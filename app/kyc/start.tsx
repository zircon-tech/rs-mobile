
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { KYCStatus } from '@/types';

export default function KYCStartScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuth();

  const handleStartKYC = () => {
    const isUS = user?.country === 'US';
    const provider = isUS ? 'Veriff' : 'ShuftiPro';

    Alert.alert(
      'KYC Verification',
      `You will be redirected to ${provider} to complete your identity verification.`,
      [
        {
          text: 'Continue',
          onPress: () => {
            // Update KYC status to in progress
            updateUser({ kycStatus: KYCStatus.IN_PROGRESS });
            
            // Simulate KYC process
            Alert.alert(
              'KYC Process',
              'In a production app, this would open the KYC provider interface. For demo purposes, we\'ll mark KYC as pending review.',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    updateUser({ kycStatus: KYCStatus.PENDING_REVIEW });
                    router.back();
                  },
                },
              ]
            );
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="arrow_back"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>KYC Verification</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <IconSymbol
              ios_icon_name="person.badge.shield.checkmark.fill"
              android_material_icon_name="verified_user"
              size={48}
              color={colors.primary}
            />
          </View>
        </View>

        <Text style={styles.title}>Identity Verification</Text>
        <Text style={styles.subtitle}>
          Complete KYC verification to start investing in tokenized properties
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What you&apos;ll need:</Text>
          <View style={styles.requirementsList}>
            <View style={styles.requirementItem}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check_circle"
                size={24}
                color={colors.success}
              />
              <Text style={styles.requirementText}>Government-issued ID (Passport, Driver&apos;s License)</Text>
            </View>
            <View style={styles.requirementItem}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check_circle"
                size={24}
                color={colors.success}
              />
              <Text style={styles.requirementText}>Selfie for identity verification</Text>
            </View>
            <View style={styles.requirementItem}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check_circle"
                size={24}
                color={colors.success}
              />
              <Text style={styles.requirementText}>Proof of address (Utility bill, Bank statement)</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verification Provider</Text>
          <View style={styles.providerCard}>
            <View style={styles.providerIcon}>
              <IconSymbol
                ios_icon_name="shield.checkered"
                android_material_icon_name="security"
                size={32}
                color={colors.primary}
              />
            </View>
            <View style={styles.providerInfo}>
              <Text style={styles.providerName}>
                {user?.country === 'US' ? 'Veriff' : 'ShuftiPro'}
              </Text>
              <Text style={styles.providerDescription}>
                {user?.country === 'US' 
                  ? 'Trusted identity verification for US investors'
                  : 'Global identity verification service'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <IconSymbol
            ios_icon_name="lock.shield.fill"
            android_material_icon_name="lock"
            size={20}
            color={colors.primary}
          />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Your data is secure</Text>
            <Text style={styles.infoText}>
              All personal information is encrypted and securely stored. We comply with GDPR and data protection regulations.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={buttonStyles.primary}
          onPress={handleStartKYC}
        >
          <Text style={buttonStyles.primaryText}>Start Verification</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  requirementsList: {
    gap: 16,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  requirementText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    lineHeight: 24,
  },
  providerCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  providerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  providerDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.highlight,
    borderRadius: 12,
    padding: 16,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
