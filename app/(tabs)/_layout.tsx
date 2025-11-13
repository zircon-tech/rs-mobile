
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';

export default function TabLayout() {
  const tabs: TabBarItem[] = [
    {
      name: 'marketplace',
      route: '/(tabs)/marketplace',
      icon: 'storefront',
      label: 'Marketplace',
    },
    {
      name: 'portfolio',
      route: '/(tabs)/portfolio',
      icon: 'pie_chart',
      label: 'Portfolio',
    },
    {
      name: 'documents',
      route: '/(tabs)/documents',
      icon: 'description',
      label: 'Documents',
    },
    {
      name: 'profile',
      route: '/(tabs)/profile',
      icon: 'person',
      label: 'Profile',
    },
  ];

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen key="marketplace" name="marketplace" />
        <Stack.Screen key="portfolio" name="portfolio" />
        <Stack.Screen key="documents" name="documents" />
        <Stack.Screen key="profile" name="profile" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
