
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { KYCStatus, AccreditationStatus } from '@/types';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const getStatusColor = (status: KYCStatus | AccreditationStatus) => {
    switch (status) {
      case KYCStatus.APPROVED:
      case AccreditationStatus.APPROVED:
        return colors.success;
      case KYCStatus.PENDING_REVIEW:
      case AccreditationStatus.PENDING_REVIEW:
        return colors.warning;
      case KYCStatus.REJECTED:
      case AccreditationStatus.REJECTED:
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusLabel = (status: KYCStatus | AccreditationStatus) => {
    return status.replace('_', ' ').toUpperCase();
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/welcome');
        },
      },
    ]);
  };

  const handleKYC = () => {
    Alert.alert('KYC Verification', 'KYC flow will be implemented with ShuftiPro/Veriff');
  };

  const handleAccreditation = () => {
    Alert.alert('Accreditation', 'Accreditation flow will be implemented');
  };

  const menuItems = [
    {
      id: 'personal',
      title: 'Personal Information',
      icon: { ios: 'person.fill', android: 'person' },
      onPress: () => Alert.alert('Personal Info', 'Edit personal information'),
    },
    {
      id: 'security',
      title: 'Security & Password',
      icon: { ios: 'lock.fill', android: 'lock' },
      onPress: () => Alert.alert('Security', 'Change password and security settings'),
    },
    {
      id: 'wallet',
      title: 'Connected Wallets',
      icon: { ios: 'wallet.pass.fill', android: 'account_balance_wallet' },
      onPress: () => Alert.alert('Wallets', 'Manage connected wallets'),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: { ios: 'bell.fill', android: 'notifications' },
      onPress: () => Alert.alert('Notifications', 'Manage notification preferences'),
    },
    {
      id: 'support',
      title: 'Help & Support',
      icon: { ios: 'questionmark.circle.fill', android: 'help' },
      onPress: () => Alert.alert('Support', 'Contact support'),
    },
    {
      id: 'terms',
      title: 'Terms & Conditions',
      icon: { ios: 'doc.text.fill', android: 'description' },
      onPress: () => Alert.alert('Terms', 'View terms and conditions'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </Text>
          </View>
          <Text style={styles.userName}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verification Status</Text>
          
          <TouchableOpacity style={styles.statusCard} onPress={handleKYC}>
            <View style={styles.statusHeader}>
              <View style={styles.statusInfo}>
                <IconSymbol
                  ios_icon_name="person.text.rectangle.fill"
                  android_material_icon_name="badge"
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.statusTitle}>KYC Verification</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(user?.kycStatus || KYCStatus.NOT_STARTED) + '20' },
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    { color: getStatusColor(user?.kycStatus || KYCStatus.NOT_STARTED) },
                  ]}
                >
                  {getStatusLabel(user?.kycStatus || KYCStatus.NOT_STARTED)}
                </Text>
              </View>
            </View>
            {user?.kycStatus === KYCStatus.NOT_STARTED && (
              <Text style={styles.statusDescription}>
                Complete KYC verification to start investing
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.statusCard} onPress={handleAccreditation}>
            <View style={styles.statusHeader}>
              <View style={styles.statusInfo}>
                <IconSymbol
                  ios_icon_name="checkmark.seal.fill"
                  android_material_icon_name="verified"
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.statusTitle}>Accreditation</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      getStatusColor(user?.accreditationStatus || AccreditationStatus.NOT_STARTED) +
                      '20',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    {
                      color: getStatusColor(
                        user?.accreditationStatus || AccreditationStatus.NOT_STARTED
                      ),
                    },
                  ]}
                >
                  {getStatusLabel(user?.accreditationStatus || AccreditationStatus.NOT_STARTED)}
                </Text>
              </View>
            </View>
            {user?.accreditationStatus === AccreditationStatus.NOT_STARTED && (
              <Text style={styles.statusDescription}>
                Upload accreditation documents to access premium properties
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <IconSymbol
                  ios_icon_name={item.icon.ios}
                  android_material_icon_name={item.icon.android}
                  size={24}
                  color={colors.text}
                />
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <IconSymbol
                ios_icon_name="chevron.right"
                android_material_icon_name="chevron_right"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <IconSymbol
            ios_icon_name="arrow.right.square.fill"
            android_material_icon_name="logout"
            size={24}
            color={colors.error}
          />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  statusCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 36,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 24,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
    marginLeft: 8,
  },
  version: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 24,
  },
});
