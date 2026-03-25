import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { useRouter } from 'expo-router';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width, height } = Dimensions.get('window');
const TINT = '#0a7ea4';

// Relative sizing helpers
const vp = (pct: number) => height * (pct / 100);
const hp = (pct: number) => width * (pct / 100);

/* ─────────────────────────────────────────────
   Decorative helpers
───────────────────────────────────────────── */

function GridLines({ isDark }: { isDark: boolean }) {
  const color = isDark ? 'rgba(10,126,164,0.07)' : 'rgba(10,126,164,0.09)';
  const hCount = 9;
  const vCount = 7;
  return (
    <>
      {Array.from({ length: hCount }).map((_, i) => (
        <View
          key={`h${i}`}
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0, right: 0,
            top: (height / (hCount - 1)) * i,
            height: StyleSheet.hairlineWidth,
            backgroundColor: color,
          }}
        />
      ))}
      {Array.from({ length: vCount }).map((_, i) => (
        <View
          key={`v${i}`}
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0, bottom: 0,
            left: (width / (vCount - 1)) * i,
            width: StyleSheet.hairlineWidth,
            backgroundColor: color,
          }}
        />
      ))}
    </>
  );
}

function TopoRings({ isDark, cx, cy }: { isDark: boolean; cx: number; cy: number }) {
  const sizes = [260, 196, 138, 86];
  return (
    <>
      {sizes.map((s, i) => (
        <View
          key={i}
          pointerEvents="none"
          style={{
            position: 'absolute',
            width: s, height: s,
            borderRadius: s / 2,
            borderWidth: 1,
            borderColor: isDark
              ? `rgba(10,126,164,${0.04 + i * 0.025})`
              : `rgba(10,126,164,${0.05 + i * 0.025})`,
            left: cx - s / 2,
            top: cy - s / 2,
          }}
        />
      ))}
    </>
  );
}

function PinMark({ size = 60 }: { size?: number }) {
  const tipW = size * 0.36;
  const tipH = size * 0.28;
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{
        position: 'absolute',
        width: size + 52, height: size + 52,
        borderRadius: (size + 52) / 2,
        borderWidth: 1, borderColor: 'rgba(10,126,164,0.12)',
        top: -26, left: -26,
      }} />
      <View style={{
        position: 'absolute',
        width: size + 26, height: size + 26,
        borderRadius: (size + 26) / 2,
        borderWidth: 1.5, borderColor: 'rgba(10,126,164,0.28)',
        top: -13, left: -13,
      }} />
      <View style={{
        width: size, height: size,
        borderRadius: size / 2,
        backgroundColor: TINT,
        alignItems: 'center', justifyContent: 'center',
        shadowColor: TINT,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.55, shadowRadius: 20, elevation: 14,
      }}>
        <View style={{
          width: size * 0.4, height: size * 0.4,
          borderRadius: size * 0.2,
          backgroundColor: 'rgba(255,255,255,0.9)',
        }} />
      </View>
      <View style={{
        width: 0, height: 0,
        borderLeftWidth: tipW / 2, borderRightWidth: tipW / 2,
        borderTopWidth: tipH,
        borderLeftColor: 'transparent', borderRightColor: 'transparent',
        borderTopColor: TINT,
        marginTop: -1,
      }} />
    </View>
  );
}

/* ─────────────────────────────────────────────
   Screen
───────────────────────────────────────────── */

export default function LandingScreen() {
  const colorScheme = useColorScheme();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const colors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  const pinCY = vp(28);

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale   = useRef(new Animated.Value(0.6)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textY       = useRef(new Animated.Value(24)).current;
  const btnsOpacity = useRef(new Animated.Value(0)).current;
  const btnsY       = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 380, useNativeDriver: true }),
      ]),
      Animated.delay(80),
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 440, useNativeDriver: true }),
        Animated.timing(textY, { toValue: 0, duration: 440, useNativeDriver: true }),
      ]),
      Animated.delay(60),
      Animated.parallel([
        Animated.timing(btnsOpacity, { toValue: 1, duration: 380, useNativeDriver: true }),
        Animated.timing(btnsY, { toValue: 0, duration: 380, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const bg = isDark ? '#0c1522' : '#f4efe6';
  const pinSize = vp(7);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <GridLines isDark={isDark} />
      <TopoRings isDark={isDark} cx={width / 2} cy={pinCY} />

      <View pointerEvents="none" style={[styles.blobTR, { backgroundColor: TINT, opacity: isDark ? 0.14 : 0.09 }]} />
      <View pointerEvents="none" style={[styles.blobBL, { backgroundColor: isDark ? '#c9963a' : TINT, opacity: isDark ? 0.09 : 0.06 }]} />

      <View style={styles.content}>

        {/* Pin logo */}
        <Animated.View style={[styles.logoWrap, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
          <PinMark size={pinSize} />
        </Animated.View>

        {/* Title + tagline + features */}
        <Animated.View style={{ opacity: textOpacity, transform: [{ translateY: textY }], alignItems: 'center' }}>
          <Text style={[styles.title, { color: isDark ? '#dce9f2' : '#0c1522', fontSize: hp(10.5) }]}>
            SpotVault
          </Text>
          <Text style={[styles.tagline, { color: isDark ? '#6a8fa8' : '#4a6a7a', fontSize: hp(3.8) }]}>
            One map. Every place you love.
          </Text>

          <View style={[styles.features, { gap: vp(0.9), marginBottom: vp(4) }]}>
            {(
              [
                { icon: 'place',        text: 'Save spots from any link or photo' },
                { icon: 'folder-open',  text: 'Organize into curated travel lists' },
                { icon: 'flight',       text: 'Plan and revisit your adventures' },
              ] as { icon: keyof typeof MaterialIcons.glyphMap; text: string }[]
            ).map(({ icon, text }) => (
              <View
                key={text}
                style={[
                  styles.featureRow,
                  {
                    paddingVertical: vp(1.4),
                    backgroundColor: isDark ? 'rgba(10,126,164,0.09)' : 'rgba(10,126,164,0.07)',
                    borderColor: isDark ? 'rgba(10,126,164,0.18)' : 'rgba(10,126,164,0.13)',
                  },
                ]}
              >
                <MaterialIcons name={icon} size={hp(4.6)} color={TINT} />
                <Text style={[styles.featureText, { color: isDark ? '#7aafc8' : '#2a5566', fontSize: hp(3.3) }]}>
                  {text}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Buttons */}
        <Animated.View style={[styles.buttons, { opacity: btnsOpacity, transform: [{ translateY: btnsY }], gap: vp(1.2) }]}>
          <TouchableOpacity style={[styles.btnPrimary, { paddingVertical: vp(1.9), shadowColor: TINT }]} activeOpacity={0.82} onPress={() => router.push('/tabs/Login' as any)}>
            <Text style={[styles.btnPrimaryText, { fontSize: hp(3.8) }]}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.btnSecondary,
              {
                paddingVertical: vp(1.9),
                borderColor: isDark ? 'rgba(10,126,164,0.48)' : 'rgba(10,126,164,0.38)',
                backgroundColor: isDark ? 'rgba(10,126,164,0.1)' : 'rgba(10,126,164,0.06)',
              },
            ]}
            activeOpacity={0.82}
            onPress={() => router.push('/tabs/Register' as any)}
          >
            <Text style={[styles.btnSecondaryText, { color: TINT, fontSize: hp(3.8) }]}>Register</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={[styles.divLine, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }]} />
            <Text style={[styles.divText, { color: isDark ? '#3d5566' : '#99aabb', fontSize: hp(3.3) }]}>or</Text>
            <View style={[styles.divLine, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }]} />
          </View>

          <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/tabs/Home' as any)}>
            <Text style={[styles.guestText, { color: isDark ? '#4a7090' : '#6a8fa0', fontSize: hp(3.3) }]}>
              Continue as guest
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={[styles.footer, { color: isDark ? '#253545' : '#aabbc8', marginTop: vp(3), fontSize: hp(2.8) }]}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>
    </SafeAreaView>
  );
}

/* ─────────────────────────────────────────────
   Styles
───────────────────────────────────────────── */

const styles = StyleSheet.create({
  container: { flex: 1, overflow: 'hidden' },

  blobTR: {
    position: 'absolute',
    width: hp(82), height: hp(82),
    borderRadius: hp(41),
    top: -hp(23), right: -hp(23),
  },
  blobBL: {
    position: 'absolute',
    width: hp(62), height: hp(62),
    borderRadius: hp(31),
    bottom: vp(10), left: -hp(18),
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: hp(7.2),
  },

  logoWrap: {
    marginBottom: vp(3.5),
  },

  title: {
    fontWeight: '800',
    letterSpacing: -1.5,
    marginBottom: vp(0.9),
    textAlign: 'center',
  },
  tagline: {
    fontWeight: '400',
    fontStyle: 'italic',
    letterSpacing: 0.2,
    textAlign: 'center',
    marginBottom: vp(2.5),
  },

  features: { width: '100%' },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderRadius: 11,
    borderWidth: 1,
    gap: 11,
  },
  featureText: {
    fontWeight: '500',
    letterSpacing: 0.1,
    flex: 1,
  },

  buttons: {
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  btnPrimary: {
    width: '100%',
    borderRadius: 13,
    alignItems: 'center',
    backgroundColor: TINT,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.38,
    shadowRadius: 14,
    elevation: 7,
  },
  btnPrimaryText: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  btnSecondary: {
    width: '100%',
    borderRadius: 13,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  btnSecondaryText: {
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 12,
    marginVertical: 2,
  },
  divLine: { flex: 1, height: 1 },
  divText: { fontWeight: '500' },
  guestText: {
    fontWeight: '500',
    paddingVertical: 6,
    letterSpacing: 0.2,
  },

  footer: {
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 12,
  },
});
