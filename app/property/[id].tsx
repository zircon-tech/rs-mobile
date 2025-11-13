
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { mockProperties } from '@/data/mockData';
import { PropertyStatus } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

const { width } = Dimensions.get('window');

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showExpressInterestModal, setShowExpressInterestModal] = useState(false);

  const property = mockProperties.find(p => p.id === id);

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

  const getStatusColor = (status: PropertyStatus) => {
    switch (status) {
      case PropertyStatus.OPEN:
        return colors.success;
      case PropertyStatus.CLOSING_SOON:
        return colors.warning;
      case PropertyStatus.COMING_SOON:
        return colors.primary;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusLabel = (status: PropertyStatus) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleExpressInterest = () => {
    setShowExpressInterestModal(true);
  };

  const handleConfirmExpressInterest = () => {
    setShowExpressInterestModal(false);
    Alert.alert(
      'Interest Registered',
      'Thank you for your interest! We will notify you when this property becomes available.',
      [
        {
          text: 'Start KYC',
          onPress: () => router.push('/kyc/start'),
        },
        {
          text: 'OK',
          style: 'cancel',
        },
      ]
    );
  };

  const handleInvestNow = () => {
    if (property.status !== PropertyStatus.OPEN) {
      Alert.alert('Not Available', 'This property is not currently open for investment.');
      return;
    }
    router.push(`/investment/start?propertyId=${property.id}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentImageIndex(index);
            }}
            scrollEventThrottle={16}
          >
            {property.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.propertyImage}
              />
            ))}
          </ScrollView>

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

          {property.images.length > 1 && (
            <View style={styles.imageIndicator}>
              {property.images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicatorDot,
                    currentImageIndex === index && styles.indicatorDotActive,
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <Text style={styles.propertyName}>{property.name}</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(property.status) + '20' },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(property.status) },
                  ]}
                >
                  {getStatusLabel(property.status)}
                </Text>
              </View>
            </View>

            <View style={styles.locationRow}>
              <IconSymbol
                ios_icon_name="location.fill"
                android_material_icon_name="location_on"
                size={18}
                color={colors.textSecondary}
              />
              <Text style={styles.locationText}>{property.location}</Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Expected ROI</Text>
              <Text style={styles.statValue}>{property.expectedROI}%</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Min. Investment</Text>
              <Text style={styles.statValue}>${property.minimumInvestment.toLocaleString()}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Token Price</Text>
              <Text style={styles.statValue}>${property.pricePerToken}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Available</Text>
              <Text style={styles.statValue}>
                {Math.round((property.availableTokens / property.totalTokens) * 100)}%
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{property.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Property Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Property Type</Text>
              <Text style={styles.detailValue}>
                {property.propertyType.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Asset Class</Text>
              <Text style={styles.detailValue}>
                {property.assetClass.toUpperCase().replace('_', ' ')}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Risk Level</Text>
              <Text style={styles.detailValue}>
                {property.riskLevel.charAt(0).toUpperCase() + property.riskLevel.slice(1)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Blockchain</Text>
              <Text style={styles.detailValue}>
                {property.blockchain === 'hedera' ? 'Hedera' : 'Stellar'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total Tokens</Text>
              <Text style={styles.detailValue}>{property.totalTokens.toLocaleString()}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Available Tokens</Text>
              <Text style={styles.detailValue}>{property.availableTokens.toLocaleString()}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Documents</Text>
            {property.documents.map(doc => (
              <TouchableOpacity
                key={doc.id}
                style={styles.documentCard}
                onPress={() => Alert.alert('Document', `Opening ${doc.name}`)}
              >
                <View style={styles.documentIcon}>
                  <IconSymbol
                    ios_icon_name="doc.fill"
                    android_material_icon_name="description"
                    size={24}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.documentInfo}>
                  <Text style={styles.documentName}>{doc.name}</Text>
                  <Text style={styles.documentSize}>
                    {(doc.size / 1000000).toFixed(1)} MB
                  </Text>
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
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={buttonStyles.outline}
          onPress={handleExpressInterest}
        >
          <Text style={buttonStyles.outlineText}>Express Interest</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[buttonStyles.primary, { flex: 1, marginLeft: 12 }]}
          onPress={handleInvestNow}
        >
          <Text style={buttonStyles.primaryText}>Invest Now</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showExpressInterestModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowExpressInterestModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Express Interest</Text>
            <Text style={styles.modalText}>
              By expressing interest in this property, you&apos;ll be notified when it becomes available for investment.
            </Text>
            <Text style={styles.modalText}>
              To invest, you&apos;ll need to complete KYC verification and accreditation.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[buttonStyles.secondary, { flex: 1, marginRight: 8 }]}
                onPress={() => setShowExpressInterestModal(false)}
              >
                <Text style={buttonStyles.secondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[buttonStyles.primary, { flex: 1, marginLeft: 8 }]}
                onPress={handleConfirmExpressInterest}
              >
                <Text style={buttonStyles.primaryText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    position: 'relative',
  },
  propertyImage: {
    width: width,
    height: 300,
    backgroundColor: colors.accent,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageIndicator: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  indicatorDotActive: {
    backgroundColor: '#FFFFFF',
    width: 24,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  propertyName: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 24,
  },
  statCard: {
    width: '50%',
    padding: 6,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  documentSize: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 24,
  },
});
