
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/IconSymbol';

// Validation regex - moved outside component to avoid re-creation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
const PHONE_REGEX = /^\d{8,15}$/;

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Validation errors
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  // Validate first name
  const validateFirstName = (value: string) => {
    if (!value.trim()) {
      setFirstNameError('First name is required');
      return false;
    }
    setFirstNameError('');
    return true;
  };

  // Validate last name
  const validateLastName = (value: string) => {
    if (!value.trim()) {
      setLastNameError('Last name is required');
      return false;
    }
    setLastNameError('');
    return true;
  };

  // Validate email
  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError('Email is required');
      return false;
    }
    if (!EMAIL_REGEX.test(value)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  // Validate password
  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError('Password is required');
      return false;
    }
    if (value.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    if (!PASSWORD_REGEX.test(value)) {
      setPasswordError('Must contain uppercase, lowercase, number, and special character');
      return false;
    }
    setPasswordError('');
    return true;
  };

  // Validate confirm password
  const validateConfirmPassword = (value: string) => {
    if (!value) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    }
    if (value !== password) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  // Validate phone number
  const validatePhoneNumber = (value: string) => {
    if (!value) {
      setPhoneNumberError('Phone number is required');
      return false;
    }
    if (!PHONE_REGEX.test(value)) {
      setPhoneNumberError('Phone number must be 8-15 digits');
      return false;
    }
    setPhoneNumberError('');
    return true;
  };

  // Check form validity
  useEffect(() => {
    const isValid =
      firstName.trim() &&
      lastName.trim() &&
      email &&
      EMAIL_REGEX.test(email) &&
      password &&
      PASSWORD_REGEX.test(password) &&
      confirmPassword &&
      password === confirmPassword &&
      phoneNumber &&
      PHONE_REGEX.test(phoneNumber) &&
      agreedToTerms;
    
    setIsFormValid(isValid);
  }, [firstName, lastName, email, password, confirmPassword, phoneNumber, agreedToTerms]);

  const handleFirstNameChange = (value: string) => {
    setFirstName(value);
    if (value) {
      validateFirstName(value);
    } else {
      setFirstNameError('');
    }
  };

  const handleLastNameChange = (value: string) => {
    setLastName(value);
    if (value) {
      validateLastName(value);
    } else {
      setLastNameError('');
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (value) {
      validateEmail(value);
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value) {
      validatePassword(value);
    } else {
      setPasswordError('');
    }
    // Re-validate confirm password if it's already filled
    if (confirmPassword) {
      validateConfirmPassword(confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (value) {
      validateConfirmPassword(value);
    } else {
      setConfirmPasswordError('');
    }
  };

  const handlePhoneNumberChange = (value: string) => {
    // Only allow numeric input
    const numericValue = value.replace(/[^0-9]/g, '');
    setPhoneNumber(numericValue);
    if (numericValue) {
      validatePhoneNumber(numericValue);
    } else {
      setPhoneNumberError('');
    }
  };

  const handleRegister = async () => {
    // Validate all fields
    const isFirstNameValid = validateFirstName(firstName);
    const isLastNameValid = validateLastName(lastName);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    const isPhoneNumberValid = validatePhoneNumber(phoneNumber);

    if (
      !isFirstNameValid ||
      !isLastNameValid ||
      !isEmailValid ||
      !isPasswordValid ||
      !isConfirmPasswordValid ||
      !isPhoneNumberValid
    ) {
      return;
    }

    if (!agreedToTerms) {
      Alert.alert('Error', 'Please agree to the Terms & Conditions');
      return;
    }

    setIsLoading(true);
    try {
      await register(email, password, firstName, lastName);
      // Navigate to Marketplace on successful registration
      Alert.alert(
        'Success',
        'Account created successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)/marketplace'),
          },
        ]
      );
    } catch (error) {
      console.log('Registration error:', error);
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    // Simulate Google Sign-Up and navigate to Marketplace
    Alert.alert(
      'Google Sign-Up',
      'Google Sign-Up will be implemented with OAuth',
      [
        {
          text: 'OK',
          onPress: () => {
            // Simulate successful Google sign-up
            router.replace('/(tabs)/marketplace');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
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
            <View style={styles.logoContainer}>
              <Image
                source={{ uri: 'https://investor.mxizirconmerge.redswandev.com/_next/static/media/logo.be69270c.png' }}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join RedSwan today</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={[
                    commonStyles.input,
                    firstNameError ? styles.inputError : null,
                  ]}
                  placeholder="First name"
                  placeholderTextColor={colors.textSecondary}
                  value={firstName}
                  onChangeText={handleFirstNameChange}
                  onBlur={() => firstName && validateFirstName(firstName)}
                  autoCapitalize="words"
                />
                {firstNameError ? (
                  <Text style={styles.errorText}>{firstNameError}</Text>
                ) : null}
              </View>
              <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={[
                    commonStyles.input,
                    lastNameError ? styles.inputError : null,
                  ]}
                  placeholder="Last name"
                  placeholderTextColor={colors.textSecondary}
                  value={lastName}
                  onChangeText={handleLastNameChange}
                  onBlur={() => lastName && validateLastName(lastName)}
                  autoCapitalize="words"
                />
                {lastNameError ? (
                  <Text style={styles.errorText}>{lastNameError}</Text>
                ) : null}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[
                  commonStyles.input,
                  emailError ? styles.inputError : null,
                ]}
                placeholder="Enter your email"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={handleEmailChange}
                onBlur={() => email && validateEmail(email)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={[
                  commonStyles.input,
                  phoneNumberError ? styles.inputError : null,
                ]}
                placeholder="Enter phone number (8-15 digits)"
                placeholderTextColor={colors.textSecondary}
                value={phoneNumber}
                onChangeText={handlePhoneNumberChange}
                onBlur={() => phoneNumber && validatePhoneNumber(phoneNumber)}
                keyboardType="phone-pad"
                maxLength={15}
              />
              {phoneNumberError ? (
                <Text style={styles.errorText}>{phoneNumberError}</Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    commonStyles.input,
                    styles.passwordInput,
                    passwordError ? styles.inputError : null,
                  ]}
                  placeholder="Create a password"
                  placeholderTextColor={colors.textSecondary}
                  value={password}
                  onChangeText={handlePasswordChange}
                  onBlur={() => password && validatePassword(password)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <IconSymbol
                    ios_icon_name={showPassword ? 'eye.slash.fill' : 'eye.fill'}
                    android_material_icon_name={showPassword ? 'visibility_off' : 'visibility'}
                    size={24}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={[
                  commonStyles.input,
                  confirmPasswordError ? styles.inputError : null,
                ]}
                placeholder="Confirm your password"
                placeholderTextColor={colors.textSecondary}
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                onBlur={() => confirmPassword && validateConfirmPassword(confirmPassword)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              {confirmPasswordError ? (
                <Text style={styles.errorText}>{confirmPasswordError}</Text>
              ) : null}
            </View>

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAgreedToTerms(!agreedToTerms)}
            >
              <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
                {agreedToTerms && (
                  <IconSymbol
                    ios_icon_name="checkmark"
                    android_material_icon_name="check"
                    size={16}
                    color="#FFFFFF"
                  />
                )}
              </View>
              <Text style={styles.checkboxText}>
                I agree to the{' '}
                <Text style={styles.linkText}>Terms & Conditions</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                buttonStyles.primary,
                (!isFormValid || isLoading) && styles.disabledButton,
              ]}
              onPress={handleRegister}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={buttonStyles.primaryText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleSignUp}
            >
              <View style={styles.googleButtonContent}>
                <IconSymbol
                  ios_icon_name="globe"
                  android_material_icon_name="language"
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.googleButtonText}>
                  Sign up with Google
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.linkText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 140,
    height: 70,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  form: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  inputError: {
    borderColor: '#FF3B30',
    borderWidth: 1,
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
    marginLeft: 4,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 14,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  disabledButton: {
    opacity: 0.5,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: colors.textSecondary,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  linkText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});
