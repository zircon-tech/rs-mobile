
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { mockDocuments } from '@/data/mockData';
import { DocumentType, DocumentStatus } from '@/types';

export default function DocumentsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filters = [
    { id: 'all', label: 'All' },
    { id: DocumentType.INVESTMENT, label: 'Investment' },
    { id: DocumentType.KYC, label: 'KYC' },
    { id: DocumentType.ACCREDITATION, label: 'Accreditation' },
    { id: DocumentType.TAX, label: 'Tax' },
  ];

  const filteredDocuments = mockDocuments.filter(doc => 
    selectedFilter === 'all' || doc.type === selectedFilter
  );

  const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.APPROVED:
        return colors.success;
      case DocumentStatus.PENDING:
        return colors.warning;
      case DocumentStatus.REJECTED:
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusLabel = (status: DocumentStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getDocumentIcon = (type: DocumentType) => {
    switch (type) {
      case DocumentType.INVESTMENT:
        return { ios: 'doc.text.fill', android: 'description' };
      case DocumentType.KYC:
        return { ios: 'person.badge.shield.checkmark.fill', android: 'verified_user' };
      case DocumentType.ACCREDITATION:
        return { ios: 'doc.badge.checkmark.fill', android: 'verified' };
      case DocumentType.TAX:
        return { ios: 'doc.plaintext.fill', android: 'receipt' };
      default:
        return { ios: 'doc.fill', android: 'description' };
    }
  };

  const handleDocumentPress = (doc: any) => {
    Alert.alert(
      doc.name,
      'In a production app, this would open the document viewer.',
      [
        { text: 'Download', onPress: () => console.log('Download document') },
        { text: 'View', onPress: () => console.log('View document') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Documents</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map(filter => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterChip,
              selectedFilter === filter.id && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === filter.id && styles.filterChipTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredDocuments.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol
              ios_icon_name="doc.text"
              android_material_icon_name="description"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyText}>No documents found</Text>
          </View>
        ) : (
          filteredDocuments.map(doc => {
            const icon = getDocumentIcon(doc.type);
            return (
              <TouchableOpacity
                key={doc.id}
                style={styles.documentCard}
                onPress={() => handleDocumentPress(doc)}
              >
                <View style={styles.documentIcon}>
                  <IconSymbol
                    ios_icon_name={icon.ios}
                    android_material_icon_name={icon.android}
                    size={24}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.documentInfo}>
                  <Text style={styles.documentName} numberOfLines={1}>
                    {doc.name}
                  </Text>
                  <Text style={styles.documentDate}>
                    {new Date(doc.uploadDate).toLocaleDateString()}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(doc.status) + '20' },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(doc.status) },
                    ]}
                  >
                    {getStatusLabel(doc.status)}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
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
  filtersScroll: {
    maxHeight: 50,
    marginBottom: 16,
  },
  filtersContent: {
    paddingHorizontal: 20,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.accent,
    marginRight: 12,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  documentDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
});
