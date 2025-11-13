
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { mockInvestments, mockTransactions } from '@/data/mockData';

export default function PortfolioScreen() {
  const router = useRouter();

  const totalInvested = mockInvestments.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalTokens = mockInvestments.reduce((sum, inv) => sum + inv.tokens, 0);
  const totalDividends = mockTransactions
    .filter(tx => tx.type === 'dividend')
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Portfolio</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total Portfolio Value</Text>
          <Text style={styles.summaryAmount}>${totalInvested.toLocaleString()}</Text>
          <View style={styles.summaryStats}>
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatLabel}>Total Tokens</Text>
              <Text style={styles.summaryStatValue}>{totalTokens}</Text>
            </View>
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatLabel}>Total Dividends</Text>
              <Text style={styles.summaryStatValue}>${totalDividends.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Investments</Text>
            <Text style={styles.sectionCount}>{mockInvestments.length}</Text>
          </View>

          {mockInvestments.map(investment => (
            <TouchableOpacity
              key={investment.id}
              style={styles.investmentCard}
              onPress={() => router.push(`/property/${investment.propertyId}`)}
            >
              <View style={styles.investmentHeader}>
                <View style={styles.investmentIcon}>
                  <IconSymbol
                    ios_icon_name="building.2.fill"
                    android_material_icon_name="apartment"
                    size={24}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.investmentInfo}>
                  <Text style={styles.investmentName} numberOfLines={1}>
                    {investment.propertyName}
                  </Text>
                  <Text style={styles.investmentDate}>
                    Purchased {new Date(investment.purchaseDate).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              <View style={styles.investmentStats}>
                <View style={styles.investmentStat}>
                  <Text style={styles.investmentStatLabel}>Tokens</Text>
                  <Text style={styles.investmentStatValue}>{investment.tokens}</Text>
                </View>
                <View style={styles.investmentStat}>
                  <Text style={styles.investmentStatLabel}>Amount</Text>
                  <Text style={styles.investmentStatValue}>
                    ${investment.totalAmount.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.investmentStat}>
                  <Text style={styles.investmentStatLabel}>Blockchain</Text>
                  <Text style={styles.investmentStatValue}>
                    {investment.blockchain === 'hedera' ? 'Hedera' : 'Stellar'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => console.log('View all transactions')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {mockTransactions.slice(0, 5).map(transaction => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionIcon}>
                <IconSymbol
                  ios_icon_name={
                    transaction.type === 'investment'
                      ? 'arrow.up.circle.fill'
                      : 'arrow.down.circle.fill'
                  }
                  android_material_icon_name={
                    transaction.type === 'investment' ? 'arrow_upward' : 'arrow_downward'
                  }
                  size={24}
                  color={transaction.type === 'investment' ? colors.primary : colors.success}
                />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionDescription} numberOfLines={1}>
                  {transaction.description}
                </Text>
                <Text style={styles.transactionDate}>
                  {new Date(transaction.date).toLocaleDateString()}
                </Text>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  { color: transaction.type === 'investment' ? colors.primary : colors.success },
                ]}
              >
                {transaction.type === 'investment' ? '-' : '+'}${transaction.amount.toLocaleString()}
              </Text>
            </View>
          ))}
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 16 : 0,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  summaryCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryStatItem: {
    flex: 1,
  },
  summaryStatLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 4,
  },
  summaryStatValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  sectionCount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  investmentCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  investmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  investmentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  investmentInfo: {
    flex: 1,
  },
  investmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  investmentDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  investmentStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  investmentStat: {
    flex: 1,
  },
  investmentStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  investmentStatValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
});
