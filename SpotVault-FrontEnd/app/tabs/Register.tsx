import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width, height } = Dimensions.get('window');
const TINT = '#0a7ea4';

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
        <View key={`h${i}`} pointerEvents="none" style={{
          position: 'absolute', left: 0, right: 0,
          top: (height / (hCount - 1)) * i,
          height: StyleSheet.hairlineWidth, backgroundColor: color,
        }} />
      ))}
      {Array.from({ length: vCount }).map((_, i) => (
        <View key={`v${i}`} pointerEvents="none" style={{
          position: 'absolute', top: 0, bottom: 0,
          left: (width / (vCount - 1)) * i,
          width: StyleSheet.hairlineWidth, backgroundColor: color,
        }} />
      ))}
    </>
  );
}

function TopoRings({ isDark, cx, cy }: { isDark: boolean; cx: number; cy: number }) {
  const sizes = [220, 164, 114, 72];
  return (
    <>
      {sizes.map((s, i) => (
        <View key={i} pointerEvents="none" style={{
          position: 'absolute',
          width: s, height: s, borderRadius: s / 2,
          borderWidth: 1,
          borderColor: isDark
            ? `rgba(10,126,164,${0.04 + i * 0.025})`
            : `rgba(10,126,164,${0.05 + i * 0.025})`,
          left: cx - s / 2, top: cy - s / 2,
        }} />
      ))}
    </>
  );
}

function PinMark({ size = 52 }: { size?: number }) {
  const tipW = size * 0.36;
  const tipH = size * 0.28;
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{
        position: 'absolute',
        width: size + 44, height: size + 44, borderRadius: (size + 44) / 2,
        borderWidth: 1, borderColor: 'rgba(10,126,164,0.12)',
        top: -22, left: -22,
      }} />
      <View style={{
        position: 'absolute',
        width: size + 22, height: size + 22, borderRadius: (size + 22) / 2,
        borderWidth: 1.5, borderColor: 'rgba(10,126,164,0.28)',
        top: -11, left: -11,
      }} />
      <View style={{
        width: size, height: size, borderRadius: size / 2,
        backgroundColor: TINT, alignItems: 'center', justifyContent: 'center',
        shadowColor: TINT, shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5, shadowRadius: 16, elevation: 12,
      }}>
        <View style={{
          width: size * 0.4, height: size * 0.4, borderRadius: size * 0.2,
          backgroundColor: 'rgba(255,255,255,0.9)',
        }} />
      </View>
      <View style={{
        width: 0, height: 0,
        borderLeftWidth: tipW / 2, borderRightWidth: tipW / 2,
        borderTopWidth: tipH,
        borderLeftColor: 'transparent', borderRightColor: 'transparent',
        borderTopColor: TINT, marginTop: -1,
      }} />
    </View>
  );
}

/* ─────────────────────────────────────────────
   Types & helpers
───────────────────────────────────────────── */

type PasswordStrength = 'weak' | 'medium' | 'strong';

function getPasswordStrength(pw: string): PasswordStrength {
  if (pw.length >= 8) return 'strong';
  if (pw.length >= 4) return 'medium';
  return 'weak';
}

const strengthColor: Record<PasswordStrength, string> = {
  weak: '#ef4444', medium: '#eab308', strong: '#22c55e',
};
const strengthLabel: Record<PasswordStrength, string> = {
  weak: 'Weak', medium: 'Medium', strong: 'Strong',
};

/* ─────────────────────────────────────────────
   Screen
───────────────────────────────────────────── */

export default function RegisterScreen() {
  const colorScheme = useColorScheme();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const handleRegister = async () => {
    if (password !== confirmPassword) return;
    setIsLoading(true);
    // TODO: call createAccount service
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale   = useRef(new Animated.Value(0.6)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formY       = useRef(new Animated.Value(20)).current;
  const btnOpacity  = useRef(new Animated.Value(0)).current;
  const btnY        = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 380, useNativeDriver: true }),
      ]),
      Animated.delay(80),
      Animated.parallel([
        Animated.timing(formOpacity, { toValue: 1, duration: 440, useNativeDriver: true }),
        Animated.timing(formY, { toValue: 0, duration: 440, useNativeDriver: true }),
      ]),
      Animated.delay(60),
      Animated.parallel([
        Animated.timing(btnOpacity, { toValue: 1, duration: 380, useNativeDriver: true }),
        Animated.timing(btnY, { toValue: 0, duration: 380, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const bg = isDark ? '#0c1522' : '#f4efe6';
  const inputBg = isDark ? 'rgba(10,126,164,0.09)' : 'rgba(10,126,164,0.07)';
  const inputBorder = isDark ? 'rgba(10,126,164,0.18)' : 'rgba(10,126,164,0.13)';
  const labelColor = isDark ? '#7aafc8' : '#2a5566';
  const dividerLine = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const dividerText = isDark ? '#3d5566' : '#99aabb';
  const textColor = isDark ? '#dce9f2' : '#0c1522';
  const placeholderColor = isDark ? '#3d5566' : '#99aabb';

  const pinSize = vp(5.8);
  const pinCY = vp(14);
  const inputPadV = vp(1.5);
  const fieldGap = vp(1.4);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <GridLines isDark={isDark} />
      <TopoRings isDark={isDark} cx={width / 2} cy={pinCY} />
      <View pointerEvents="none" style={[styles.blobTR, { backgroundColor: TINT, opacity: isDark ? 0.14 : 0.09 }]} />
      <View pointerEvents="none" style={[styles.blobBL, { backgroundColor: isDark ? '#c9963a' : TINT, opacity: isDark ? 0.09 : 0.06 }]} />

      <View style={[styles.inner, { paddingHorizontal: hp(7.2) }]}>

        {/* Back */}
        <TouchableOpacity style={styles.back} onPress={() => router.push('/tabs/Landing' as any)} activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={hp(5)} color={TINT} />
        </TouchableOpacity>

        {/* Logo */}
        <Animated.View style={[styles.logoWrap, { marginBottom: vp(2.2), opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
          <PinMark size={pinSize} />
        </Animated.View>

        {/* Header */}
        <Animated.View style={{ opacity: formOpacity, transform: [{ translateY: formY }], alignItems: 'center' }}>
          <Text style={[styles.title, { color: textColor, fontSize: hp(9) }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: isDark ? '#6a8fa8' : '#4a6a7a', fontSize: hp(3.6), marginBottom: vp(2.2) }]}>
            Start saving your favorite spots today.
          </Text>

          {/* Fields */}
          <View style={[styles.fields, { gap: fieldGap }]}>
            {/* Name */}
            <View>
              <Text style={[styles.label, { color: labelColor, fontSize: hp(3.2) }]}>Full name</Text>
              <TextInput
                style={[styles.input, { paddingVertical: inputPadV, backgroundColor: inputBg, borderColor: inputBorder, color: textColor, fontSize: hp(3.8) }]}
                placeholder="John Doe" placeholderTextColor={placeholderColor}
                autoCapitalize="words" autoComplete="name"
                value={name} onChangeText={setName}
              />
            </View>

            {/* Email */}
            <View>
              <Text style={[styles.label, { color: labelColor, fontSize: hp(3.2) }]}>Email</Text>
              <TextInput
                style={[styles.input, { paddingVertical: inputPadV, backgroundColor: inputBg, borderColor: inputBorder, color: textColor, fontSize: hp(3.8) }]}
                placeholder="you@example.com" placeholderTextColor={placeholderColor}
                autoCapitalize="none" autoComplete="email" keyboardType="email-address"
                value={email} onChangeText={setEmail}
              />
            </View>

            {/* Password */}
            <View>
              <Text style={[styles.label, { color: labelColor, fontSize: hp(3.2) }]}>Password</Text>
              <View>
                <TextInput
                  style={[styles.input, styles.inputWithIcon, { paddingVertical: inputPadV, backgroundColor: inputBg, borderColor: inputBorder, color: textColor, fontSize: hp(3.8) }]}
                  placeholder="Create a password" placeholderTextColor={placeholderColor}
                  secureTextEntry={!showPassword} autoComplete="new-password"
                  value={password} onChangeText={setPassword}
                />
                <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(v => !v)} activeOpacity={0.7}>
                  <MaterialIcons name={showPassword ? 'visibility-off' : 'visibility'} size={hp(4.8)} color={TINT} />
                </TouchableOpacity>
              </View>
              {password.length > 0 && (
                <View style={[styles.strengthRow, { marginTop: vp(0.7) }]}>
                  <View style={styles.strengthBars}>
                    {(['weak', 'medium', 'strong'] as PasswordStrength[]).map((level, i) => {
                      const active = ['weak', 'medium', 'strong'].indexOf(passwordStrength) >= i;
                      return (
                        <View key={level} style={[styles.strengthBar, { backgroundColor: active ? strengthColor[passwordStrength] : (isDark ? 'rgba(10,126,164,0.15)' : 'rgba(10,126,164,0.1)') }]} />
                      );
                    })}
                  </View>
                  <Text style={[styles.strengthLabel, { color: strengthColor[passwordStrength], fontSize: hp(3) }]}>
                    {strengthLabel[passwordStrength]}
                  </Text>
                </View>
              )}
            </View>

            {/* Confirm password */}
            <View>
              <Text style={[styles.label, { color: labelColor, fontSize: hp(3.2) }]}>Confirm password</Text>
              <View>
                <TextInput
                  style={[styles.input, styles.inputWithIcon, { paddingVertical: inputPadV, backgroundColor: inputBg, borderColor: !passwordsMatch ? '#ef4444' : inputBorder, color: textColor, fontSize: hp(3.8) }]}
                  placeholder="Repeat your password" placeholderTextColor={placeholderColor}
                  secureTextEntry={!showConfirmPassword} autoComplete="new-password"
                  value={confirmPassword} onChangeText={setConfirmPassword}
                />
                <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowConfirmPassword(v => !v)} activeOpacity={0.7}>
                  <MaterialIcons name={showConfirmPassword ? 'visibility-off' : 'visibility'} size={hp(4.8)} color={TINT} />
                </TouchableOpacity>
              </View>
              {!passwordsMatch && (
                <Text style={[styles.errorText, { fontSize: hp(3) }]}>Passwords do not match</Text>
              )}
            </View>
          </View>

          {/* Terms checkbox */}
          <TouchableOpacity style={[styles.checkboxRow, { marginTop: vp(1.6), marginBottom: vp(0.8) }]} activeOpacity={0.7} onPress={() => setAccepted(v => !v)}>
            <View style={[styles.checkbox, { borderColor: accepted ? TINT : inputBorder, backgroundColor: accepted ? TINT : 'transparent' }]}>
              {accepted && <MaterialIcons name="check" size={hp(3.5)} color="#fff" />}
            </View>
            <Text style={[styles.checkboxLabel, { color: isDark ? '#6a8fa8' : '#4a6a7a', fontSize: hp(3.3) }]}>
              I agree to the{' '}
              <Text style={{ color: TINT }}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={{ color: TINT }}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Buttons */}
        <Animated.View style={[styles.buttons, { gap: vp(1.1), opacity: btnOpacity, transform: [{ translateY: btnY }] }]}>
          <TouchableOpacity
            style={[styles.btnPrimary, { paddingVertical: vp(1.8), shadowColor: TINT, opacity: canSubmit ? 1 : 0.45 }]}
            activeOpacity={0.82} disabled={!canSubmit} onPress={handleRegister}
          >
            {isLoading
              ? <ActivityIndicator color="#fff" />
              : <Text style={[styles.btnPrimaryText, { fontSize: hp(3.8) }]}>Create account</Text>
            }
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={[styles.divLine, { backgroundColor: dividerLine }]} />
            <Text style={[styles.divText, { color: dividerText, fontSize: hp(3.3) }]}>or</Text>
            <View style={[styles.divLine, { backgroundColor: dividerLine }]} />
          </View>

          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={[styles.signInText, { color: dividerText, fontSize: hp(3.3) }]}>
              Already have an account?{' '}
              <Text style={{ color: TINT, fontWeight: '600' }}>Sign in</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={[styles.footer, { color: isDark ? '#253545' : '#aabbc8', marginTop: vp(1.8), fontSize: hp(2.7) }]}>
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
    paddingTop: vp(2),
    paddingBottom: vp(2.5),
  },

  back: {
    alignSelf: 'flex-start',
    marginBottom: vp(1.8),
  },

  logoWrap: { alignSelf: 'center' },

  title: {
    fontWeight: '800', letterSpacing: -1.5,
    marginBottom: vp(0.7), textAlign: 'center',
  },
  subtitle: {
    fontWeight: '400', fontStyle: 'italic',
    letterSpacing: 0.2, textAlign: 'center',
  },

  fields: { width: '100%' },
  label: { fontWeight: '500', marginBottom: vp(0.6), letterSpacing: 0.1 },
  input: {
    borderWidth: 1, borderRadius: 11,
    paddingHorizontal: 16,
  },
  inputWithIcon: { paddingRight: 48 },
  eyeBtn: { position: 'absolute', right: 14, top: 0, bottom: 0, justifyContent: 'center' },

  strengthRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  strengthBars: { flexDirection: 'row', flex: 1, gap: 4 },
  strengthBar: { flex: 1, height: 4, borderRadius: 2 },
  strengthLabel: { fontWeight: '500', width: 44, textAlign: 'right' },

  errorText: { color: '#ef4444', marginTop: 4 },

  checkboxRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  checkbox: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center', marginTop: 1,
  },
  checkboxLabel: { flex: 1, lineHeight: 20 },

  buttons: { width: '100%', alignItems: 'center' },
  btnPrimary: {
    width: '100%', borderRadius: 13, alignItems: 'center',
    backgroundColor: TINT,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.38, shadowRadius: 14, elevation: 7,
  },
  btnPrimaryText: { color: '#fff', fontWeight: '700', letterSpacing: 0.4 },

  divider: { flexDirection: 'row', alignItems: 'center', width: '100%', gap: 12, marginVertical: 2 },
  divLine: { flex: 1, height: 1 },
  divText: { fontWeight: '500' },

  signInText: { fontWeight: '500', paddingVertical: 4, letterSpacing: 0.2 },

  footer: { textAlign: 'center', lineHeight: 15, paddingHorizontal: 12 },
});
