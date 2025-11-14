
import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {
    // Auto redirect after 2 seconds
    const timer = setTimeout(() => {
      router.replace('/(auth)/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://investor.mxizirconmerge.redswandev.com/_next/static/media/logo.be69270c.png' }}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.tagline}>Tokenized Real Estate Investment</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    width: 200,
    height: 120,
  },
  tagline: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
