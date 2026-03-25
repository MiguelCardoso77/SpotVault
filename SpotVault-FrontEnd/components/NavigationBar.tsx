import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width } = Dimensions.get('window');
const TINT = '#0a7ea4';

type TabItem = {
  icon: keyof typeof MaterialIcons.glyphMap;
  key: string;
  label?: string;
  route?: string;
  ready: boolean;
};

const TABS: TabItem[] = [
  { key: 'map',       icon: 'map',    label: 'My Map',    route: '/tabs/Home',      ready: true  },
  { key: 'community', icon: 'people', label: 'Trending',  route: '/tabs/Community', ready: true  },
  { key: 'create',    icon: 'add',                        route: '/tabs/Create',    ready: true  },
  { key: 'lists',     icon: 'folder', label: 'Lists',     route: '/tabs/Lists',     ready: true  },
  { key: 'profile',   icon: 'person', label: 'Profile',   route: '/tabs/Profile',   ready: true  },
];

export default function NavigationBar() {
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === 'dark';
  const pathname = usePathname();
  const router = useRouter();

  const bg       = isDark ? '#0d1b2a' : '#ffffff';
  const border   = isDark ? 'rgba(10,126,164,0.15)' : 'rgba(0,0,0,0.07)';
  const inactive = isDark ? '#2e4a5e' : '#b0c4cf';

  return (
    <View
      style={[
        styles.wrapper,
        {
          paddingBottom: insets.bottom || 12,
          backgroundColor: bg,
          borderTopColor: border,
        },
      ]}
      pointerEvents="box-none"
    >
      {TABS.map((tab) => {
        const isCreate = tab.key === 'create';
        const isActive = tab.route ? pathname.startsWith(tab.route) : false;
        const color = isActive ? '#ffffff' : inactive;

        if (isCreate) {
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.createWrap}
              activeOpacity={0.85}
              onPress={() => tab.route && router.replace(tab.route as any)}
            >
              <View style={styles.createBtn}>
                <MaterialIcons name="add" size={width * 0.075} color="#fff" />
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            activeOpacity={tab.ready ? 0.7 : 1}
            onPress={() => {
              if (!tab.ready || !tab.route || isActive) return;
              router.replace(tab.route as any);
            }}
          >
            <MaterialIcons name={tab.icon} size={width * 0.058} color={color} />
            <Text style={[styles.label, { color, fontSize: width * 0.026 }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 4,
  },
  label: {
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  createWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  createBtn: {
    width: width * 0.145,
    height: width * 0.145,
    borderRadius: width * 0.0725,
    backgroundColor: TINT,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: TINT,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 10,
  },
});
