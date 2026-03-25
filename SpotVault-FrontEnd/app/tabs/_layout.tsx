import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import NavigationBar from '@/components/NavigationBar';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        tabBar={() => <></>}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: isDark ? '#0c1522' : '#f4efe6' },
        }}
      >
        <Tabs.Screen name="Home" />
        <Tabs.Screen name="Community" />
        <Tabs.Screen name="Create" />
        <Tabs.Screen name="Lists" />
        <Tabs.Screen name="Profile" />
        <Tabs.Screen name="Landing" options={{ href: null }} />
        <Tabs.Screen name="Login" options={{ href: null }} />
        <Tabs.Screen name="Register" options={{ href: null }} />
      </Tabs>
      <NavigationBar />
    </View>
  );
}
