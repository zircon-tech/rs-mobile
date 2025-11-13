
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
import { mockProperties } from '@/data/mockData';

export default function InvestmentWalletScreen() {
  const { propertyId, tokens, amount } = useLocalSearchParams();
  const router = useRouter();
  const [selectedWallet, setSelectedWallet] = useState<'metamask' | 'freighter' | null>(null);

  const property = mockProperties.find(p => p.id === propertyId);

  if (!property) {
    return null;
  }

  const handleConnectWallet = (walletType: 'metamask' | 'freighter') => {
    setSelectedWallet(walletType);
    
    // Simulate wallet connection
    setTimeout(() => {
      Alert.alert(
        'Wallet Connected',
        `${walletType === 'metamask' ? 'MetaMask' : 'Freighter'} wallet connected successfully`,
        [
          {
            text: 'Continue',
            onPress: () => {
              router.push({
                pathname: '/investment/terms',
                params: {
                  propertyId,
                  tokens,
                  amount,
                  walletType,
                },
              });
            },
          },
        ]
      );
    }, 1000);
  };

  const recommendedWallet = property.blockchain === 'hedera' ? 'metamask' : 'freighter';

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
        <Text style={styles.headerTitle}>Connect Wallet</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '25%' }]} />
          </View>
          <Text style={styles.progressText}>Step 1 of 4</Text>
        </View>

        <Text style={styles.title}>Connect Your Wallet</Text>
        <Text style={styles.subtitle}>
          Connect your wallet to complete the investment on the {property.blockchain === 'hedera' ? 'Hedera' : 'Stellar'} blockchain
        </Text>

        <View style={styles.walletOptions}>
          <TouchableOpacity
            style={[
              styles.walletCard,
              recommendedWallet === 'metamask' && styles.walletCardRecommended,
            ]}
            onPress={() => handleConnectWallet('metamask')}
          >
            {recommendedWallet === 'metamask' && (
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedText}>Recommended</Text>
              </View>
            )}
            <View style={styles.walletIcon}>
              <IconSymbol
                ios_icon_name="wallet.pass.fill"
                android_material_icon_name="account_balance_wallet"
                size={32}
                color={colors.primary}
              />
            </View>
            <Text style={styles.walletName}>MetaMask</Text>
            <Text style={styles.walletDescription}>
              For Hedera blockchain investments
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.walletCard,
              recommendedWallet === 'freighter' && styles.walletCardRecommended,
            ]}
            onPress={() => handleConnectWallet('freighter')}
          >
            {recommendedWallet === 'freighter' && (
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedText}>Recommended</Text>
              </View>
            )}
            <View style={styles.walletIcon}>
              <IconSymbol
                ios_icon_name="wallet.pass.fill"
                android_material_icon_name="account_balance_wallet"
                size={32}
                color={colors.primary}
              />
            </View>
            <Text style={styles.walletName}>Freighter</Text>
            <Text style={styles.walletDescription}>
              For Stellar blockchain investments
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <IconSymbol
            ios_icon_name="info.circle.fill"
            android_material_icon_name="info"
            size={20}
            color={colors.primary}
          />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>WalletConnect Integration</Text>
            <Text style={styles.infoText}>
              We use WalletConnect to securely connect your wallet. Your private keys never leave your device.
            </Text>
          </View>
        </View>
      </ScrollView>
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
  },
  progressContainer: {
    marginBottom: 32,
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 32,
  },
  walletOptions: {
    marginBottom: 24,
  },
  walletCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    position: 'relative',
  },
  walletCardRecommended: {
    borderColor: colors.primary,
  },
  recommendedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  walletIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  walletName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  walletDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
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
});
