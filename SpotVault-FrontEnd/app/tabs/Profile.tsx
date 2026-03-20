import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type SettingRowProps = {
  label: string;
  onPress: () => void;
  destructive?: boolean;
};

function SettingRow({ label, onPress, destructive = false }: SettingRowProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <TouchableOpacity
      style={[styles.settingRow, { borderBottomColor: colors.icon + '33' }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.settingLabel, destructive ? styles.destructive : { color: colors.text }]}>
        {label}
      </Text>
      <Text style={{ color: colors.icon }}>›</Text>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Avatar + name */}
      <ThemedView style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: colors.tint }]}>
          <Text style={styles.avatarInitial}>M</Text>
        </View>
        <ThemedText type="title" style={styles.name}>Miguel</ThemedText>
        <ThemedText style={{ color: colors.icon }}>Free plan</ThemedText>
      </ThemedView>

      {/* Supporter upsell */}
      <TouchableOpacity style={[styles.upsellCard, { backgroundColor: colors.tint }]} activeOpacity={0.85}>
        <Text style={styles.upsellTitle}>Upgrade to Supporter</Text>
        <Text style={styles.upsellSub}>Unlock AI photo recognition and more</Text>
      </TouchableOpacity>

      {/* Settings sections */}
      <ThemedView style={styles.section}>
        <ThemedText type="defaultSemiBold" style={[styles.sectionTitle, { color: colors.icon }]}>
          ACCOUNT
        </ThemedText>
        <SettingRow label="Edit Profile" onPress={() => {}} />
        <SettingRow label="Change Password" onPress={() => {}} />
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="defaultSemiBold" style={[styles.sectionTitle, { color: colors.icon }]}>
          PREFERENCES
        </ThemedText>
        <SettingRow label="Notifications" onPress={() => {}} />
        <SettingRow label="Community Rankings" onPress={() => {}} />
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="defaultSemiBold" style={[styles.sectionTitle, { color: colors.icon }]}>
          GENERAL
        </ThemedText>
        <SettingRow label="Privacy Policy" onPress={() => {}} />
        <SettingRow label="Terms of Service" onPress={() => {}} />
        <SettingRow label="Sign Out" onPress={() => {}} destructive />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 24,
    gap: 6,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarInitial: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '600',
  },
  name: {
    fontSize: 22,
  },
  upsellCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
    gap: 4,
  },
  upsellTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  upsellSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 11,
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingLabel: {
    fontSize: 15,
  },
  destructive: {
    color: '#FF3B30',
  },
});