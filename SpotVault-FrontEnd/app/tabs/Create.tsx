import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useColorScheme } from '@/hooks/use-color-scheme';

const { width, height } = Dimensions.get('window');
const TINT = '#0a7ea4';

const vp = (pct: number) => height * (pct / 100);
const hp = (pct: number) => width * (pct / 100);

/* ─────────────────────────────────────────────
   Decorative
───────────────────────────────────────────── */

function GridLines({ isDark }: { isDark: boolean }) {
  const color = isDark ? 'rgba(10,126,164,0.07)' : 'rgba(10,126,164,0.09)';
  return (
    <>
      {Array.from({ length: 9 }).map((_, i) => (
        <View key={`h${i}`} pointerEvents="none" style={{
          position: 'absolute', left: 0, right: 0,
          top: (height / 8) * i,
          height: StyleSheet.hairlineWidth, backgroundColor: color,
        }} />
      ))}
      {Array.from({ length: 7 }).map((_, i) => (
        <View key={`v${i}`} pointerEvents="none" style={{
          position: 'absolute', top: 0, bottom: 0,
          left: (width / 6) * i,
          width: StyleSheet.hairlineWidth, backgroundColor: color,
        }} />
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────
   Source types
───────────────────────────────────────────── */

type Source = 'instagram' | 'googlemaps' | 'applemaps';

const SOURCES: {
  key: Source;
  label: string;
  placeholder: string;
  color: string;
  icon: React.ReactNode;
}[] = [
  {
    key: 'instagram',
    label: 'Instagram',
    placeholder: 'https://www.instagram.com/p/...',
    color: '#E1306C',
    icon: null, // set below
  },
  {
    key: 'googlemaps',
    label: 'Google Maps',
    placeholder: 'https://maps.google.com/... or https://goo.gl/...',
    color: '#4285F4',
    icon: null,
  },
  {
    key: 'applemaps',
    label: 'Apple Maps',
    placeholder: 'https://maps.apple.com/...',
    color: '#555555',
    icon: null,
  },
];

/* ─────────────────────────────────────────────
   Screen
───────────────────────────────────────────── */

export default function CreateScreen() {
  const isDark = useColorScheme() === 'dark';
  const router = useRouter();

  const [selected, setSelected] = useState<Source | null>(null);
  const [url, setUrl] = useState('');

  const headerAnim = useRef(new Animated.Value(0)).current;
  const headerY    = useRef(new Animated.Value(20)).current;
  const cardsAnim  = useRef(new Animated.Value(0)).current;
  const cardsY     = useRef(new Animated.Value(20)).current;
  const inputAnim  = useRef(new Animated.Value(0)).current;
  const inputY     = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(headerAnim, { toValue: 1, duration: 380, useNativeDriver: true }),
        Animated.timing(headerY,    { toValue: 0, duration: 380, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(cardsAnim,  { toValue: 1, duration: 360, useNativeDriver: true }),
        Animated.timing(cardsY,     { toValue: 0, duration: 360, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  useEffect(() => {
    if (selected) {
      inputAnim.setValue(0);
      inputY.setValue(12);
      Animated.parallel([
        Animated.timing(inputAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(inputY,    { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    }
  }, [selected]);

  const bg          = isDark ? '#0c1522' : '#f4efe6';
  const textColor   = isDark ? '#dce9f2' : '#0c1522';
  const mutedColor  = isDark ? '#6a8fa8' : '#4a6a7a';
  const cardBg      = isDark ? 'rgba(10,126,164,0.09)' : 'rgba(10,126,164,0.07)';
  const cardBorder  = isDark ? 'rgba(10,126,164,0.18)' : 'rgba(10,126,164,0.13)';
  const inputBg     = isDark ? 'rgba(10,126,164,0.09)' : 'rgba(10,126,164,0.07)';
  const placeholder = isDark ? '#3d5566' : '#99aabb';

  const activeSource = SOURCES.find(s => s.key === selected);

  const iconSize = hp(7);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <GridLines isDark={isDark} />
      <View pointerEvents="none" style={[styles.blobTR, { backgroundColor: TINT, opacity: isDark ? 0.14 : 0.09 }]} />
      <View pointerEvents="none" style={[styles.blobBL, { backgroundColor: isDark ? '#c9963a' : TINT, opacity: isDark ? 0.09 : 0.06 }]} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.inner, { paddingHorizontal: hp(7.2) }]}>

          {/* Close button */}
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => router.replace('/tabs/Home' as any)}
            activeOpacity={0.7}
          >
            <MaterialIcons name="close" size={hp(6)} color={mutedColor} />
          </TouchableOpacity>

          {/* Header */}
          <Animated.View style={[styles.header, { opacity: headerAnim, transform: [{ translateY: headerY }] }]}>
            <Text style={[styles.title, { color: textColor, fontSize: hp(9) }]}>
              Add a Spot
            </Text>
            <Text style={[styles.subtitle, { color: mutedColor, fontSize: hp(3.6) }]}>
              Import from a link.
            </Text>
          </Animated.View>

          {/* Source cards */}
          <Animated.View style={[styles.sources, { opacity: cardsAnim, transform: [{ translateY: cardsY }] }]}>
            {SOURCES.map(source => {
              const isActive = selected === source.key;
              return (
                <TouchableOpacity
                  key={source.key}
                  style={[
                    styles.sourceCard,
                    {
                      backgroundColor: isActive
                        ? `${source.color}18`
                        : cardBg,
                      borderColor: isActive
                        ? `${source.color}66`
                        : cardBorder,
                    },
                  ]}
                  activeOpacity={0.75}
                  onPress={() => {
                    setSelected(source.key);
                    setUrl('');
                  }}
                >
                  {/* Icon */}
                  <View style={[styles.sourceIconWrap, {
                    backgroundColor: `${source.color}18`,
                    borderColor: `${source.color}33`,
                  }]}>
                    {source.key === 'instagram' && (
                      <FontAwesome name="instagram" size={iconSize * 0.7} color={source.color} />
                    )}
                    {source.key === 'googlemaps' && (
                      <MaterialCommunityIcons name="google-maps" size={iconSize * 0.75} color={source.color} />
                    )}
                    {source.key === 'applemaps' && (
                      <FontAwesome name="apple" size={iconSize * 0.7} color={isDark ? '#e0e0e0' : '#333'} />
                    )}
                  </View>

                  {/* Label */}
                  <Text style={[styles.sourceLabel, {
                    color: isActive ? source.color : textColor,
                    fontSize: hp(3.8),
                  }]}>
                    {source.label}
                  </Text>

                  {/* Active check */}
                  {isActive && (
                    <MaterialIcons name="check-circle" size={hp(5)} color={source.color} style={styles.sourceCheck} />
                  )}
                </TouchableOpacity>
              );
            })}
          </Animated.View>

          {/* URL input */}
          {selected && (
            <Animated.View style={[styles.inputSection, { opacity: inputAnim, transform: [{ translateY: inputY }] }]}>
              <Text style={[styles.inputLabel, { color: mutedColor, fontSize: hp(3.2) }]}>
                Paste your {activeSource?.label} link
              </Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, {
                    backgroundColor: inputBg,
                    borderColor: activeSource ? `${activeSource.color}55` : cardBorder,
                    color: textColor,
                    fontSize: hp(3.5),
                    flex: 1,
                  }]}
                  placeholder={activeSource?.placeholder}
                  placeholderTextColor={placeholder}
                  value={url}
                  onChangeText={setUrl}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="url"
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.importBtn,
                  {
                    backgroundColor: url.length > 0 ? TINT : cardBg,
                    borderColor: url.length > 0 ? TINT : cardBorder,
                    shadowColor: TINT,
                    opacity: url.length > 0 ? 1 : 0.5,
                  },
                ]}
                activeOpacity={0.82}
                disabled={url.length === 0}
              >
                <MaterialIcons name="download" size={hp(4.5)} color={url.length > 0 ? '#fff' : mutedColor} />
                <Text style={[styles.importBtnText, {
                  color: url.length > 0 ? '#fff' : mutedColor,
                  fontSize: hp(3.8),
                }]}>
                  Import Spot
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ─────────────────────────────────────────────
   Styles
───────────────────────────────────────────── */

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, overflow: 'hidden' },

  blobTR: {
    position: 'absolute',
    width: hp(82), height: hp(82), borderRadius: hp(41),
    top: -hp(23), right: -hp(23),
  },
  blobBL: {
    position: 'absolute',
    width: hp(62), height: hp(62), borderRadius: hp(31),
    bottom: vp(10), left: -hp(18),
  },

  inner: {
    flex: 1,
    paddingTop: vp(2.5),
    paddingBottom: vp(4),
  },

  closeBtn: {
    alignSelf: 'flex-end',
    marginBottom: vp(1),
    padding: 4,
  },

  header: { marginBottom: vp(3.5) },
  title:    { fontWeight: '800', letterSpacing: -1.5, marginBottom: vp(0.6) },
  subtitle: { fontStyle: 'italic', fontWeight: '400', letterSpacing: 0.2 },

  sources: { gap: vp(1.4) },

  sourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: hp(4),
    borderRadius: 13,
    borderWidth: 1,
    paddingHorizontal: hp(4.5),
    paddingVertical: vp(1.8),
  },
  sourceIconWrap: {
    width: hp(12),
    height: hp(12),
    borderRadius: hp(6),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sourceLabel: { flex: 1, fontWeight: '600', letterSpacing: 0.1 },
  sourceCheck: { marginLeft: 'auto' },

  inputSection: { marginTop: vp(3), gap: vp(1.2) },
  inputLabel:   { fontWeight: '500', letterSpacing: 0.1 },
  inputRow:     { flexDirection: 'row', gap: hp(2.5) },

  input: {
    borderWidth: 1,
    borderRadius: 11,
    paddingHorizontal: hp(4),
    paddingVertical: vp(1.6),
  },

  importBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: hp(2.5),
    borderRadius: 13,
    borderWidth: 1,
    paddingVertical: vp(1.8),
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 7,
    marginTop: vp(0.5),
  },
  importBtnText: { fontWeight: '700', letterSpacing: 0.4 },
});
