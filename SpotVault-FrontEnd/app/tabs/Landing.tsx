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

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width, height } = Dimensions.get('window');
const isSmall = height < 700;
const TINT = '#0a7ea4';

/* ─────────────────────────────────────────────
   Decorative helpers
───────────────────────────────────────────── */

function GridLines({ isDark }: { isDark: boolean }) {
  const color = isDark
    ? 'rgba(10,126,164,0.07)'
    : 'rgba(10,126,164,0.09)';
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
            left: 0,
            right: 0,
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
            top: 0,
            bottom: 0,
            left: (width / (vCount - 1)) * i,
            width: StyleSheet.hairlineWidth,
            backgroundColor: color,
          }}
        />
      ))}
    </>
  );
}

function TopoRings({
  isDark,
  cx,
  cy,
}: {
  isDark: boolean;
  cx: number;
  cy: number;
}) {
  const sizes = [260, 196, 138, 86];
  return (
    <>
      {sizes.map((s, i) => (
        <View
          key={i}
          pointerEvents="none"
          style={{
            position: 'absolute',
            width: s,
            height: s,
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
      {/* Outer glow ring */}
      <View
        style={{
          position: 'absolute',
          width: size + 52,
          height: size + 52,
          borderRadius: (size + 52) / 2,
          borderWidth: 1,
          borderColor: 'rgba(10,126,164,0.12)',
          top: -26,
          left: -26,
        }}
      />
      {/* Inner halo ring */}
      <View
        style={{
          position: 'absolute',
          width: size + 26,
          height: size + 26,
          borderRadius: (size + 26) / 2,
          borderWidth: 1.5,
          borderColor: 'rgba(10,126,164,0.28)',
          top: -13,
          left: -13,
        }}
      />
      {/* Pin circle body */}
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: TINT,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: TINT,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.55,
          shadowRadius: 20,
          elevation: 14,
        }}
      >
        {/* White dot */}
        <View
          style={{
            width: size * 0.4,
            height: size * 0.4,
            borderRadius: size * 0.2,
            backgroundColor: 'rgba(255,255,255,0.9)',
          }}
        />
      </View>
      {/* Pin tip — downward triangle */}
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: tipW / 2,
          borderRightWidth: tipW / 2,
          borderTopWidth: tipH,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: TINT,
          marginTop: -1,
        }}
      />
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

  // Topographic rings follow the logo position (rough vertical center)
  const pinCY = height * 0.28;

  // Staggered entrance animations
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale   = useRef(new Animated.Value(0.6)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textY       = useRef(new Animated.Value(24)).current;
  const btnsOpacity = useRef(new Animated.Value(0)).current;
  const btnsY       = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 380,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(80),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 440,
          useNativeDriver: true,
        }),
        Animated.timing(textY, {
          toValue: 0,
          duration: 440,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(60),
      Animated.parallel([
        Animated.timing(btnsOpacity, {
          toValue: 1,
          duration: 380,
          useNativeDriver: true,
        }),
        Animated.timing(btnsY, {
          toValue: 0,
          duration: 380,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const bg = isDark ? '#0c1522' : '#f4efe6';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      {/* Map coordinate grid */}
      <GridLines isDark={isDark} />

      {/* Topographic concentric rings */}
      <TopoRings isDark={isDark} cx={width / 2} cy={pinCY} />

      {/* Atmospheric blobs */}
      <View
        pointerEvents="none"
        style={[
          styles.blobTR,
          { backgroundColor: TINT, opacity: isDark ? 0.14 : 0.09 },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.blobBL,
          {
            backgroundColor: isDark ? '#c9963a' : TINT,
            opacity: isDark ? 0.09 : 0.06,
          },
        ]}
      />

      {/* ── Main content ── */}
      <View style={styles.content}>

        {/* Pin logo mark */}
        <Animated.View
          style={[
            styles.logoWrap,
            { opacity: logoOpacity, transform: [{ scale: logoScale }] },
          ]}
        >
          <PinMark size={isSmall ? 48 : 56} />
        </Animated.View>

        {/* Title + tagline + features */}
        <Animated.View
          style={{
            opacity: textOpacity,
            transform: [{ translateY: textY }],
            alignItems: 'center',
          }}
        >
          <Text style={[styles.title, { color: isDark ? '#dce9f2' : '#0c1522' }]}>
            SpotVault
          </Text>

          <Text style={[styles.tagline, { color: isDark ? '#6a8fa8' : '#4a6a7a' }]}>
            One map. Every place you love.
          </Text>

          {/* Feature highlights */}
          <View style={styles.features}>
            {(
              [
                { icon: 'place',         text: 'Save spots from any link or photo' },
                { icon: 'folder-open',   text: 'Organize into curated travel lists' },
                { icon: 'flight',        text: 'Plan and revisit your adventures' },
              ] as { icon: keyof typeof MaterialIcons.glyphMap; text: string }[]
            ).map(({ icon, text }) => (
              <View
                key={text}
                style={[
                  styles.featureRow,
                  {
                    backgroundColor: isDark
                      ? 'rgba(10,126,164,0.09)'
                      : 'rgba(10,126,164,0.07)',
                    borderColor: isDark
                      ? 'rgba(10,126,164,0.18)'
                      : 'rgba(10,126,164,0.13)',
                  },
                ]}
              >
                <MaterialIcons name={icon} size={18} color={TINT} />
                <Text
                  style={[
                    styles.featureText,
                    { color: isDark ? '#7aafc8' : '#2a5566' },
                  ]}
                >
                  {text}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Buttons */}
        <Animated.View
          style={[
            styles.buttons,
            { opacity: btnsOpacity, transform: [{ translateY: btnsY }] },
          ]}
        >
          <TouchableOpacity
            style={[styles.btnPrimary, { shadowColor: TINT }]}
            activeOpacity={0.82}
          >
            <Text style={styles.btnPrimaryText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.btnSecondary,
              {
                borderColor: isDark
                  ? 'rgba(10,126,164,0.48)'
                  : 'rgba(10,126,164,0.38)',
                backgroundColor: isDark
                  ? 'rgba(10,126,164,0.1)'
                  : 'rgba(10,126,164,0.06)',
              },
            ]}
            activeOpacity={0.82}
          >
            <Text style={[styles.btnSecondaryText, { color: TINT }]}>
              Register
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View
              style={[
                styles.divLine,
                {
                  backgroundColor: isDark
                    ? 'rgba(255,255,255,0.08)'
                    : 'rgba(0,0,0,0.08)',
                },
              ]}
            />
            <Text
              style={[
                styles.divText,
                { color: isDark ? '#3d5566' : '#99aabb' },
              ]}
            >
              or
            </Text>
            <View
              style={[
                styles.divLine,
                {
                  backgroundColor: isDark
                    ? 'rgba(255,255,255,0.08)'
                    : 'rgba(0,0,0,0.08)',
                },
              ]}
            />
          </View>

          <TouchableOpacity activeOpacity={0.7}>
            <Text
              style={[
                styles.guestText,
                { color: isDark ? '#4a7090' : '#6a8fa0' },
              ]}
            >
              Continue as guest
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Text
          style={[
            styles.footer,
            { color: isDark ? '#253545' : '#aabbc8' },
          ]}
        >
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
  container: {
    flex: 1,
  },

  // Atmospheric blobs
  blobTR: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    top: -90,
    right: -90,
  },
  blobBL: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    bottom: height * 0.1,
    left: -70,
  },

  // Layout
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },

  // Logo
  logoWrap: {
    marginBottom: isSmall ? 24 : 32,
  },

  // Typography
  title: {
    fontSize: isSmall ? 36 : 42,
    fontWeight: '800',
    letterSpacing: -1.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: isSmall ? 14 : 15,
    fontWeight: '400',
    fontStyle: 'italic',
    letterSpacing: 0.2,
    textAlign: 'center',
    marginBottom: isSmall ? 18 : 24,
  },

  // Feature rows
  features: {
    width: '100%',
    gap: 7,
    marginBottom: isSmall ? 24 : 32,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: isSmall ? 9 : 11,
    paddingHorizontal: 14,
    borderRadius: 11,
    borderWidth: 1,
    gap: 11,
  },
  featureText: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.1,
    flex: 1,
  },

  // Buttons
  buttons: {
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    gap: 10,
  },
  btnPrimary: {
    width: '100%',
    paddingVertical: isSmall ? 14 : 16,
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
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  btnSecondary: {
    width: '100%',
    paddingVertical: isSmall ? 14 : 16,
    borderRadius: 13,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  btnSecondaryText: {
    fontSize: 15,
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
  divLine: {
    flex: 1,
    height: 1,
  },
  divText: {
    fontSize: 13,
    fontWeight: '500',
  },
  guestText: {
    fontSize: 13,
    fontWeight: '500',
    paddingVertical: 6,
    letterSpacing: 0.2,
  },

  // Footer
  footer: {
    marginTop: isSmall ? 20 : 32,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 12,
  },
});