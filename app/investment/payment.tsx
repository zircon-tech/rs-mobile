
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import * as DocumentPicker from 'expo-document-picker';

export default function InvestmentPaymentScreen() {
  const { propertyId, tokens, amount, walletType } = useLocalSearchParams();
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<'ach' | 'wire' | null>(null);
  const [paymentProofUploaded, setPaymentProofUploaded] = useState(false);

  const handleUploadProof = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
      });

      if (!result.canceled && result.assets.length > 0) {
        setPaymentProofUploaded(true);
        Alert.alert('Success', 'Payment proof uploaded successfully');
      }
    } catch (error) {
      console.log('Error picking document:', error);
      Alert.alert('Error', 'Failed to upload payment proof');
    }
  };

  const handleCompleteInvestment = () => {
    if (!selectedMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    if (!paymentProofUploaded) {
      Alert.alert('Error', 'Please upload payment proof');
      return;
    }

    Alert.alert(
      'Investment Submitted',
      'Your investment has been submitted and is pending confirmation. You will receive a notification once the transaction is complete.',
      [
        {
          text: 'View Portfolio',
          onPress: () => router.replace('/(tabs)/portfolio'),
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
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '100%' }]} />
        </View>
        <Text style={styles.progressText}>Step 4 of 4</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Total Investment Amount</Text>
          <Text style={styles.amountValue}>${parseInt(amount as string).toLocaleString()}</Text>
          <Text style={styles.amountTokens}>{tokens} tokens</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <TouchableOpacity
            style={[
              styles.paymentCard,
              selectedMethod === 'ach' && styles.paymentCardSelected,
            ]}
            onPress={() => setSelectedMethod('ach')}
          >
            <View style={styles.paymentIcon}>
              <IconSymbol
                ios_icon_name="building.columns.fill"
                android_material_icon_name="account_balance"
                size={24}
                color={selectedMethod === 'ach' ? colors.primary : colors.textSecondary}
              />
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentName}>ACH Transfer</Text>
              <Text style={styles.paymentDescription}>
                Direct bank transfer (3-5 business days)
              </Text>
            </View>
            {selectedMethod === 'ach' && (
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check_circle"
                size={24}
                color={colors.primary}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentCard,
              selectedMethod === 'wire' && styles.paymentCardSelected,
            ]}
            onPress={() => setSelectedMethod('wire')}
          >
            <View style={styles.paymentIcon}>
              <IconSymbol
                ios_icon_name="arrow.left.arrow.right"
                android_material_icon_name="swap_horiz"
                size={24}
                color={selectedMethod === 'wire' ? colors.primary : colors.textSecondary}
              />
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentName}>Wire Transfer</Text>
              <Text style={styles.paymentDescription}>
                International wire transfer (1-2 business days)
              </Text>
            </View>
            {selectedMethod === 'wire' && (
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check_circle"
                size={24}
                color={colors.primary}
              />
            )}
          </TouchableOpacity>
        </View>

        {selectedMethod && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bank Details</Text>
            <View style={styles.bankDetailsCard}>
              <View style={styles.bankDetailRow}>
                <Text style={styles.bankDetailLabel}>Bank Name</Text>
                <Text style={styles.bankDetailValue}>RedSwan Bank</Text>
              </View>
              <View style={styles.bankDetailRow}>
                <Text style={styles.bankDetailLabel}>Account Name</Text>
                <Text style={styles.bankDetailValue}>RedSwan CRE LLC</Text>
              </View>
              <View style={styles.bankDetailRow}>
                <Text style={styles.bankDetailLabel}>Account Number</Text>
                <Text style={styles.bankDetailValue}>1234567890</Text>
              </View>
              <View style={styles.bankDetailRow}>
                <Text style={styles.bankDetailLabel}>Routing Number</Text>
                <Text style={styles.bankDetailValue}>021000021</Text>
              </View>
              <View style={styles.bankDetailRow}>
                <Text style={styles.bankDetailLabel}>Reference</Text>
                <Text style={styles.bankDetailValue}>INV-{propertyId}-{Date.now()}</Text>
              </View>
            </View>
          </View>
        )}

        {selectedMethod && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upload Payment Proof</Text>
            <TouchableOpacity
              style={styles.uploadCard}
              onPress={handleUploadProof}
            >
              <View style={styles.uploadIcon}>
                <IconSymbol
                  ios_icon_name={paymentProofUploaded ? 'checkmark.circle.fill' : 'arrow.up.doc.fill'}
                  android_material_icon_name={paymentProofUploaded ? 'check_circle' : 'upload_file'}
                  size={32}
                  color={paymentProofUploaded ? colors.success : colors.primary}
                />
              </View>
              <Text style={styles.uploadText}>
                {paymentProofUploaded ? 'Payment proof uploaded' : 'Upload payment confirmation'}
              </Text>
              <Text style={styles.uploadSubtext}>
                {paymentProofUploaded ? 'Tap to change' : 'PDF, JPG, or PNG'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.infoCard}>
          <IconSymbol
            ios_icon_name="info.circle.fill"
            android_material_icon_name="info"
            size={20}
            color={colors.primary}
          />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Payment Processing</Text>
            <Text style={styles.infoText}>
              Once we receive and verify your payment, your tokens will be minted and transferred to your wallet. This process typically takes 1-3 business days.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            buttonStyles.primary,
            (!selectedMethod || !paymentProofUploaded) && styles.disabledButton,
          ]}
          onPress={handleCompleteInvestment}
          disabled={!selectedMethod || !paymentProofUploaded}
        >
          <Text style={buttonStyles.primaryText}>Complete Investment</Text>
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
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.accent,
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  amountCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  amountLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  amountTokens: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
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
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  paymentCardSelected: {
    borderColor: colors.primary,
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  paymentDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  bankDetailsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bankDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  bankDetailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  bankDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  uploadCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  uploadIcon: {
    marginBottom: 16,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
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
  disabledButton: {
    opacity: 0.5,
  },
});
