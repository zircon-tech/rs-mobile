
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
import { AccreditationStatus } from '@/types';
import * as DocumentPicker from 'expo-document-picker';

export default function AccreditationStartScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuth();

  const handleUploadDocuments = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        multiple: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        Alert.alert(
          'Documents Uploaded',
          'Your accreditation documents have been uploaded and are pending review.',
          [
            {
              text: 'OK',
              onPress: () => {
                updateUser({ accreditationStatus: AccreditationStatus.PENDING_REVIEW });
                router.back();
              },
            },
          ]
        );
      }
    } catch (error) {
      console.log('Error picking document:', error);
      Alert.alert('Error', 'Failed to upload documents. Please try again.');
    }
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
        <Text style={styles.headerTitle}>Accreditation</Text>
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
              ios_icon_name="doc.badge.checkmark.fill"
              android_material_icon_name="verified"
              size={48}
              color={colors.primary}
            />
          </View>
        </View>

        <Text style={styles.title}>Investor Accreditation</Text>
        <Text style={styles.subtitle}>
          Upload documents to verify your accredited investor status
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accreditation Requirements</Text>
          <Text style={styles.sectionDescription}>
            To qualify as an accredited investor, you must meet one of the following criteria:
          </Text>
          <View style={styles.requirementsList}>
            <View style={styles.requirementItem}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check_circle"
                size={24}
                color={colors.success}
              />
              <Text style={styles.requirementText}>
                Annual income exceeding $200,000 (or $300,000 with spouse) for the last two years
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check_circle"
                size={24}
                color={colors.success}
              />
              <Text style={styles.requirementText}>
                Net worth exceeding $1 million (excluding primary residence)
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check_circle"
                size={24}
                color={colors.success}
              />
              <Text style={styles.requirementText}>
                Hold certain professional certifications (Series 7, 65, or 82 licenses)
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Required Documents</Text>
          <View style={styles.documentsList}>
            <View style={styles.documentItem}>
              <IconSymbol
                ios_icon_name="doc.text.fill"
                android_material_icon_name="description"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.documentText}>Tax returns (last 2 years)</Text>
            </View>
            <View style={styles.documentItem}>
              <IconSymbol
                ios_icon_name="doc.text.fill"
                android_material_icon_name="description"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.documentText}>Bank statements</Text>
            </View>
            <View style={styles.documentItem}>
              <IconSymbol
                ios_icon_name="doc.text.fill"
                android_material_icon_name="description"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.documentText}>Investment account statements</Text>
            </View>
            <View style={styles.documentItem}>
              <IconSymbol
                ios_icon_name="doc.text.fill"
                android_material_icon_name="description"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.documentText}>Professional certifications (if applicable)</Text>
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
            <Text style={styles.infoTitle}>Confidential & Secure</Text>
            <Text style={styles.infoText}>
              All documents are encrypted and reviewed by our compliance team. Your information is never shared with third parties.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={buttonStyles.primary}
          onPress={handleUploadDocuments}
        >
          <Text style={buttonStyles.primaryText}>Upload Documents</Text>
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
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
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
  documentsList: {
    gap: 12,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  documentText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
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
