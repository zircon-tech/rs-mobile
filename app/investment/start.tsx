
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { mockProperties } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { KYCStatus, AccreditationStatus } from '@/types';

export default function InvestmentStartScreen() {
  const { propertyId } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [tokens, setTokens] = useState('');

  const property = mockProperties.find(p => p.id === propertyId);

  if (!property) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Property not found</Text>
          <TouchableOpacity
            style={buttonStyles.primary}
            onPress={() => router.back()}
          >
            <Text style={buttonStyles.primaryText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const calculateAmount = () => {
    const tokenCount = parseInt(tokens) || 0;
    return tokenCount * property.pricePerToken;
  };

  const handleContinue = () => {
    const tokenCount = parseInt(tokens) || 0;
    const amount = calculateAmount();

    if (tokenCount < 1) {
      Alert.alert('Error', 'Please enter a valid number of tokens');
      return;
    }

    if (amount < property.minimumInvestment) {
      Alert.alert(
        'Minimum Investment',
        `The minimum investment for this property is $${property.minimumInvestment.toLocaleString()}`
      );
      return;
    }

    if (tokenCount > property.availableTokens) {
      Alert.alert(
        'Not Available',
        `Only ${property.availableTokens} tokens are available for this property`
      );
      return;
    }

    // Check KYC and Accreditation status
    if (user?.kycStatus !== KYCStatus.APPROVED) {
      Alert.alert(
        'KYC Required',
        'You need to complete KYC verification before investing.',
        [
          {
            text: 'Start KYC',
            onPress: () => router.push('/kyc/start'),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
      return;
    }

    if (user?.accreditationStatus !== AccreditationStatus.APPROVED) {
      Alert.alert(
        'Accreditation Required',
        'You need to complete accreditation before investing.',
        [
          {
            text: 'Start Accreditation',
            onPress: () => router.push('/accreditation/start'),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
      return;
    }

    // Proceed to wallet connection
    router.push({
      pathname: '/investment/wallet',
      params: {
        propertyId: property.id,
        tokens: tokenCount.toString(),
        amount: amount.toString(),
      },
    });
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
        <Text style={styles.headerTitle}>Investment Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.propertyCard}>
          <Text style={styles.propertyName}>{property.name}</Text>
          <Text style={styles.propertyLocation}>{property.location}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Investment Amount</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Number of Tokens</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="Enter number of tokens"
              placeholderTextColor={colors.textSecondary}
              value={tokens}
              onChangeText={setTokens}
              keyboardType="number-pad"
            />
            <View style={styles.inputInfo}>
              <Text style={styles.inputInfoText}>
                Token Price: ${property.pricePerToken}
              </Text>
              <Text style={styles.inputInfoText}>
                Available: {property.availableTokens.toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={styles.calculationCard}>
            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>Tokens</Text>
              <Text style={styles.calculationValue}>{tokens || '0'}</Text>
            </View>
            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>Price per Token</Text>
              <Text style={styles.calculationValue}>${property.pricePerToken}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.calculationRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>${calculateAmount().toLocaleString()}</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <IconSymbol
              ios_icon_name="info.circle.fill"
              android_material_icon_name="info"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.infoText}>
              Minimum investment: ${property.minimumInvestment.toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Investment Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Expected ROI</Text>
              <Text style={styles.summaryValue}>{property.expectedROI}%</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Blockchain</Text>
              <Text style={styles.summaryValue}>
                {property.blockchain === 'hedera' ? 'Hedera' : 'Stellar'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Risk Level</Text>
              <Text style={styles.summaryValue}>
                {property.riskLevel.charAt(0).toUpperCase() + property.riskLevel.slice(1)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={buttonStyles.primary}
          onPress={handleContinue}
        >
          <Text style={buttonStyles.primaryText}>Continue</Text>
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
  propertyCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  propertyName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  propertyLocation: {
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
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  inputInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  inputInfoText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  calculationCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  calculationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  calculationLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  calculationValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.highlight,
    borderRadius: 12,
    padding: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 20,
  },
});
