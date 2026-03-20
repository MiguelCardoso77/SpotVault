import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { height } = Dimensions.get('window');

export default function LandingScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Decorative pin blobs */}
      <View style={[styles.blobTopRight, { backgroundColor: colors.tint }]} pointerEvents="none" />
      <View style={[styles.blobBottomLeft, { backgroundColor: colors.tint }]} pointerEvents="none" />

      {/* Main content */}
      <View style={styles.content}>
        {/* Logo box */}
        <View style={[
          styles.logoBox,
          {
            backgroundColor: isDark ? '#ffffff10' : '#00000008',
            borderColor: isDark ? '#ffffff15' : '#00000010',
          },
        ]}>
          <Text style={[styles.logoEmoji]}>📍</Text>
        </View>

        {/* App name */}
        <Text style={[styles.title, { color: colors.text }]}>SpotVault</Text>

        {/* Tagline */}
        <Text style={[styles.tagline, { color: colors.icon }]}>
          Your personal map of memories.{'\n'}
          <Text style={[styles.taglineSub, { color: colors.icon }]}>
            Save, organize, and revisit your favorite spots.
          </Text>
        </Text>

        {/* Buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.btnPrimary, { backgroundColor: colors.text }]}
            activeOpacity={0.85}
          >
            <Text style={[styles.btnPrimaryText, { color: colors.background }]}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.btnSecondary,
              {
                borderColor: isDark ? '#ffffff20' : '#00000015',
                backgroundColor: isDark ? '#ffffff08' : '#00000005',
              },
            ]}
            activeOpacity={0.85}
          >
            <Text style={[styles.btnSecondaryText, { color: colors.text }]}>Register</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: isDark ? '#ffffff15' : '#00000010' }]} />
            <Text style={[styles.dividerText, { color: colors.icon }]}>or</Text>
            <View style={[styles.dividerLine, { backgroundColor: isDark ? '#ffffff15' : '#00000010' }]} />
          </View>

          <TouchableOpacity activeOpacity={0.7}>
            <Text style={[styles.btnGuest, { color: colors.icon }]}>Continue as guest</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={[styles.footer, { color: colors.icon }]}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blobTopRight: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    top: height * 0.1,
    right: -60,
    opacity: 0.06,
  },
  blobBottomLeft: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    bottom: height * 0.2,
    left: -40,
    opacity: 0.04,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoBox: {
    marginBottom: 32,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  logoEmoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 48,
  },
  taglineSub: {
    fontSize: 14,
  },
  buttons: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    gap: 12,
  },
  btnPrimary: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnPrimaryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  btnSecondary: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  btnSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 4,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 14,
  },
  btnGuest: {
    fontSize: 14,
    fontWeight: '500',
    paddingVertical: 8,
  },
  footer: {
    marginTop: 48,
    fontSize: 11,
    textAlign: 'center',
    opacity: 0.6,
    paddingHorizontal: 16,
  },
});