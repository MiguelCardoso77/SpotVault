import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type PasswordStrength = 'weak' | 'medium' | 'strong';

function getPasswordStrength(pw: string): PasswordStrength {
  if (pw.length >= 8) return 'strong';
  if (pw.length >= 4) return 'medium';
  return 'weak';
}

const strengthColor: Record<PasswordStrength, string> = {
  weak: '#ef4444',
  medium: '#eab308',
  strong: '#22c55e',
};

const strengthLabel: Record<PasswordStrength, string> = {
  weak: 'Weak',
  medium: 'Medium',
  strong: 'Strong',
};

export default function RegisterScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordStrength = getPasswordStrength(password);
  const passwordsMatch = confirmPassword === '' || password === confirmPassword;
  const canSubmit = accepted && passwordsMatch && password !== '' && !isLoading;

  const borderColor = isDark ? '#ffffff20' : '#00000015';
  const bgColor = isDark ? '#ffffff08' : '#00000005';

  const handleRegister = async () => {
    if (password !== confirmPassword) return;
    setIsLoading(true);
    // TODO: call createAccount service
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back button */}
          <TouchableOpacity style={styles.back} onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={[styles.backArrow, { color: colors.icon }]}>←</Text>
            <Text style={[styles.backLabel, { color: colors.icon }]}>Back</Text>
          </TouchableOpacity>

          {/* Logo */}
          <View style={[styles.logoBox, { backgroundColor: bgColor, borderColor }]}>
            <Text style={styles.logoEmoji}>📍</Text>
          </View>

          {/* Header */}
          <Text style={[styles.title, { color: colors.text }]}>Create account</Text>
          <Text style={[styles.subtitle, { color: colors.icon }]}>
            Start saving your favorite spots today.
          </Text>

          {/* Fields */}
          <View style={styles.fields}>
            {/* Name */}
            <View>
              <Text style={[styles.label, { color: colors.text }]}>Full name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: bgColor, borderColor, color: colors.text }]}
                placeholder="John Doe"
                placeholderTextColor={colors.icon}
                autoCapitalize="words"
                autoComplete="name"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Email */}
            <View>
              <Text style={[styles.label, { color: colors.text }]}>Email</Text>
              <TextInput
                style={[styles.input, { backgroundColor: bgColor, borderColor, color: colors.text }]}
                placeholder="you@example.com"
                placeholderTextColor={colors.icon}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Password */}
            <View>
              <Text style={[styles.label, { color: colors.text }]}>Password</Text>
              <View>
                <TextInput
                  style={[styles.input, styles.inputWithIcon, { backgroundColor: bgColor, borderColor, color: colors.text }]}
                  placeholder="Create a password"
                  placeholderTextColor={colors.icon}
                  secureTextEntry={!showPassword}
                  autoComplete="new-password"
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword(v => !v)}
                  activeOpacity={0.7}
                >
                  <Text style={{ color: colors.icon, fontSize: 16 }}>{showPassword ? '🙈' : '👁'}</Text>
                </TouchableOpacity>
              </View>

              {/* Strength indicator */}
              {password.length > 0 && (
                <View style={styles.strengthRow}>
                  <View style={styles.strengthBars}>
                    {(['weak', 'medium', 'strong'] as PasswordStrength[]).map((level, i) => {
                      const levels = ['weak', 'medium', 'strong'];
                      const active = levels.indexOf(passwordStrength) >= i;
                      return (
                        <View
                          key={level}
                          style={[
                            styles.strengthBar,
                            { backgroundColor: active ? strengthColor[passwordStrength] : (isDark ? '#ffffff15' : '#00000010') },
                          ]}
                        />
                      );
                    })}
                  </View>
                  <Text style={[styles.strengthLabel, { color: strengthColor[passwordStrength] }]}>
                    {strengthLabel[passwordStrength]}
                  </Text>
                </View>
              )}
            </View>

            {/* Confirm password */}
            <View>
              <Text style={[styles.label, { color: colors.text }]}>Confirm password</Text>
              <View>
                <TextInput
                  style={[
                    styles.input,
                    styles.inputWithIcon,
                    {
                      backgroundColor: bgColor,
                      borderColor: !passwordsMatch ? '#ef4444' : borderColor,
                      color: colors.text,
                    },
                  ]}
                  placeholder="Repeat your password"
                  placeholderTextColor={colors.icon}
                  secureTextEntry={!showConfirmPassword}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowConfirmPassword(v => !v)}
                  activeOpacity={0.7}
                >
                  <Text style={{ color: colors.icon, fontSize: 16 }}>{showConfirmPassword ? '🙈' : '👁'}</Text>
                </TouchableOpacity>
              </View>
              {!passwordsMatch && (
                <Text style={styles.errorText}>Passwords do not match</Text>
              )}
            </View>
          </View>

          {/* Terms checkbox */}
          <TouchableOpacity
            style={styles.checkboxRow}
            activeOpacity={0.7}
            onPress={() => setAccepted(v => !v)}
          >
            <View style={[
              styles.checkbox,
              {
                borderColor: accepted ? colors.tint : borderColor,
                backgroundColor: accepted ? colors.tint : 'transparent',
              },
            ]}>
              {accepted && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={[styles.checkboxLabel, { color: colors.icon }]}>
              I agree to the{' '}
              <Text style={{ color: colors.tint }}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={{ color: colors.tint }}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.btnPrimary, { backgroundColor: colors.text, opacity: canSubmit ? 1 : 0.4 }]}
            activeOpacity={0.85}
            disabled={!canSubmit}
            onPress={handleRegister}
          >
            {isLoading
              ? <ActivityIndicator color={colors.background} />
              : <Text style={[styles.btnPrimaryText, { color: colors.background }]}>Create account</Text>
            }
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: borderColor }]} />
            <Text style={[styles.dividerText, { color: colors.icon }]}>or</Text>
            <View style={[styles.dividerLine, { backgroundColor: borderColor }]} />
          </View>

          {/* Login link */}
          <TouchableOpacity style={styles.loginLink} onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={[styles.loginLinkText, { color: colors.icon }]}>
              Already have an account?{' '}
              <Text style={{ color: colors.tint, fontWeight: '600' }}>Sign in</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1 },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  backArrow: { fontSize: 18 },
  backLabel: { fontSize: 14, fontWeight: '500' },
  logoBox: {
    alignSelf: 'center',
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  logoEmoji: { fontSize: 32 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 28,
    textAlign: 'center',
  },
  fields: { gap: 16, marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '500', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },
  inputWithIcon: { paddingRight: 48 },
  eyeBtn: {
    position: 'absolute',
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  strengthBars: { flexDirection: 'row', flex: 1, gap: 4 },
  strengthBar: { flex: 1, height: 4, borderRadius: 2 },
  strengthLabel: { fontSize: 12, fontWeight: '500', width: 44, textAlign: 'right' },
  errorText: { color: '#ef4444', fontSize: 12, marginTop: 4 },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 24,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkmark: { color: '#fff', fontSize: 13, fontWeight: '700', lineHeight: 16 },
  checkboxLabel: { flex: 1, fontSize: 14, lineHeight: 22 },
  btnPrimary: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  btnPrimaryText: { fontSize: 16, fontWeight: '600' },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 14 },
  loginLink: { alignItems: 'center' },
  loginLinkText: { fontSize: 14 },
});