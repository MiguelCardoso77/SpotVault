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
const TINT = '#0a7ea4';

const vp = (pct: number) => height * (pct / 100);
const hp = (pct: number) => width * (pct / 100);

/* ─────────────────────────────────────────────
   Decorative background
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
   Setting row
───────────────────────────────────────────── */

type SettingRowProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
  destructive?: boolean;
  isDark: boolean;
};

function SettingRow({ icon, label, onPress, destructive = false, isDark }: SettingRowProps) {
  const cardBg = isDark ? 'rgba(10,126,164,0.09)' : 'rgba(10,126,164,0.07)';
  const cardBorder = isDark ? 'rgba(10,126,164,0.18)' : 'rgba(10,126,164,0.13)';
  const labelColor = destructive ? '#ef4444' : (isDark ? '#dce9f2' : '#0c1522');
  const iconColor = destructive ? '#ef4444' : TINT;
  const chevronColor = isDark ? '#3d5566' : '#99aabb';

  return (
    <TouchableOpacity
      style={[styles.settingRow, { backgroundColor: cardBg, borderColor: cardBorder }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <MaterialIcons name={icon} size={hp(4.8)} color={iconColor} />
        <Text style={[styles.settingLabel, { color: labelColor, fontSize: hp(3.8) }]}>
          {label}
        </Text>
      </View>
      <MaterialIcons name="chevron-right" size={hp(4.8)} color={chevronColor} />
    </TouchableOpacity>
  );
}

/* ─────────────────────────────────────────────
   Screen
───────────────────────────────────────────── */

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const colors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

  const headerAnim = useRef(new Animated.Value(0)).current;
  const cardsAnim  = useRef(new Animated.Value(0)).current;
  const cardsY     = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerAnim, { toValue: 1, duration: 420, useNativeDriver: true }),
      Animated.delay(60),
      Animated.parallel([
        Animated.timing(cardsAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(cardsY, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const bg = isDark ? '#0c1522' : '#f4efe6';
  const mutedColor = isDark ? '#6a8fa8' : '#4a6a7a';
  const sectionLabelColor = isDark ? '#3d5566' : '#99aabb';
  const upsellBorder = isDark ? 'rgba(10,126,164,0.35)' : 'rgba(10,126,164,0.25)';
  const upsellBg = isDark ? 'rgba(10,126,164,0.14)' : 'rgba(10,126,164,0.09)';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <GridLines isDark={isDark} />

      {/* Blobs */}
      <View pointerEvents="none" style={[styles.blobTR, { backgroundColor: TINT, opacity: isDark ? 0.14 : 0.09 }]} />
      <View pointerEvents="none" style={[styles.blobBL, { backgroundColor: isDark ? '#c9963a' : TINT, opacity: isDark ? 0.09 : 0.06 }]} />

      <View style={[styles.inner, { paddingHorizontal: hp(7.2), paddingBottom: vp(12) }]}>

        {/* ── Header ── */}
        <Animated.View style={[styles.header, { opacity: headerAnim }]}>

          {/* Avatar */}
          <View style={styles.avatarWrap}>
            <View style={[styles.avatarRing, { borderColor: `rgba(10,126,164,0.35)` }]} />
            <View style={[styles.avatarInnerRing, { borderColor: `rgba(10,126,164,0.6)` }]} />
            <View style={[styles.avatar, {
              shadowColor: TINT,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.5,
              shadowRadius: 16,
              elevation: 12,
            }]}>
              <Text style={[styles.avatarInitial, { fontSize: hp(8) }]}>M</Text>
            </View>
          </View>

          {/* Name + badge */}
          <Text style={[styles.username, { color: isDark ? '#dce9f2' : '#0c1522', fontSize: hp(7.5) }]}>
            Miguel
          </Text>
          <View style={[styles.badge, { backgroundColor: isDark ? 'rgba(10,126,164,0.18)' : 'rgba(10,126,164,0.12)', borderColor: isDark ? 'rgba(10,126,164,0.35)' : 'rgba(10,126,164,0.25)' }]}>
            <Text style={[styles.badgeText, { color: TINT, fontSize: hp(2.8) }]}>Free plan</Text>
          </View>
        </Animated.View>

        {/* ── Cards ── */}
        <Animated.View style={[styles.cards, { opacity: cardsAnim, transform: [{ translateY: cardsY }] }]}>

          {/* Upsell */}
          <TouchableOpacity
            style={[styles.upsellCard, { backgroundColor: upsellBg, borderColor: upsellBorder }]}
            activeOpacity={0.82}
          >
            <View style={styles.upsellLeft}>
              <MaterialIcons name="auto-awesome" size={hp(5)} color={TINT} />
              <View style={styles.upsellText}>
                <Text style={[styles.upsellTitle, { color: isDark ? '#dce9f2' : '#0c1522', fontSize: hp(3.8) }]}>
                  Upgrade to Supporter
                </Text>
                <Text style={[styles.upsellSub, { color: mutedColor, fontSize: hp(3.1) }]}>
                  AI photo recognition · profile badge · no ads
                </Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={hp(4.8)} color={TINT} />
          </TouchableOpacity>

          {/* Account */}
          <Text style={[styles.sectionTitle, { color: sectionLabelColor, fontSize: hp(2.8), marginTop: vp(2.2) }]}>
            ACCOUNT
          </Text>
          <View style={[styles.section, { gap: vp(0.8) }]}>
            <SettingRow icon="edit"  label="Edit Profile"      onPress={() => {}} isDark={isDark} />
            <SettingRow icon="lock"  label="Change Password"   onPress={() => {}} isDark={isDark} />
          </View>

          {/* Preferences */}
          <Text style={[styles.sectionTitle, { color: sectionLabelColor, fontSize: hp(2.8), marginTop: vp(1.8) }]}>
            PREFERENCES
          </Text>
          <View style={[styles.section, { gap: vp(0.8) }]}>
            <SettingRow icon="notifications" label="Notifications"        onPress={() => {}} isDark={isDark} />
            <SettingRow icon="leaderboard"   label="Community Rankings"   onPress={() => {}} isDark={isDark} />
          </View>

          {/* General */}
          <Text style={[styles.sectionTitle, { color: sectionLabelColor, fontSize: hp(2.8), marginTop: vp(1.8) }]}>
            GENERAL
          </Text>
          <View style={[styles.section, { gap: vp(0.8) }]}>
            <SettingRow icon="shield"      label="Privacy Policy"   onPress={() => {}} isDark={isDark} />
            <SettingRow icon="description" label="Terms of Service" onPress={() => {}} isDark={isDark} />
            <SettingRow icon="logout"      label="Sign Out"         onPress={() => {}} isDark={isDark} destructive />
          </View>

        </Animated.View>
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
    paddingTop: vp(3),
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: vp(3),
  },
  avatarWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vp(1.8),
  },
  avatarRing: {
    position: 'absolute',
    width: hp(28), height: hp(28), borderRadius: hp(14),
    borderWidth: 1,
  },
  avatarInnerRing: {
    position: 'absolute',
    width: hp(23), height: hp(23), borderRadius: hp(11.5),
    borderWidth: 1.5,
  },
  avatar: {
    width: hp(18), height: hp(18), borderRadius: hp(9),
    backgroundColor: TINT,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInitial: {
    color: '#fff',
    fontWeight: '700',
  },
  username: {
    fontWeight: '800',
    letterSpacing: -1.5,
    marginBottom: vp(0.8),
  },
  badge: {
    paddingHorizontal: hp(3.5),
    paddingVertical: vp(0.5),
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeText: {
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // Cards
  cards: { flex: 1 },

  upsellCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 13,
    borderWidth: 1,
    paddingHorizontal: hp(4),
    paddingVertical: vp(1.6),
  },
  upsellLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: hp(3.5),
    flex: 1,
  },
  upsellText: { flex: 1, gap: vp(0.3) },
  upsellTitle: { fontWeight: '700' },
  upsellSub: { fontWeight: '400' },

  sectionTitle: {
    fontWeight: '600',
    letterSpacing: 0.9,
    marginBottom: vp(0.8),
  },
  section: {},

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 11,
    borderWidth: 1,
    paddingHorizontal: hp(4),
    paddingVertical: vp(1.4),
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: hp(3.5),
  },
  settingLabel: { fontWeight: '500' },
});
