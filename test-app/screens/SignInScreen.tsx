import React, { useState, useRef } from 'react';
import { View, 
        Text, 
        TouchableOpacity, 
        KeyboardAvoidingView, 
        ScrollView, 
        TextInput,
        ActivityIndicator, 
        Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { styles } from '../styles/SignInStyle';
import { colors } from '../theme';


type Props = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

type Mode = 'signIn' | 'signUp';
type Field = 'email' | 'password';
type Errors = Partial<Record<Field, string>>;
 
const MIN_PASSWORD = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PLACEHOLDER = `${colors.navy}99`;

const COPY = {
  signIn: {
    title: 'Welcome Back',
    blurb: 'Sign in to see your saved lab reports.',
    button: 'Sign In',
    prompt: 'New to LabDog?',
    switchTo: 'Create Account',
  },
  signUp: {
    title: 'Create Your Account',
    blurb: 'Save your lab reports & come back to them later.',
    button: 'Create Account',
    prompt: 'Already have an account?',
    switchTo: 'Sign In',
  },
};

export default function SignInScreen(): React.JSX.Element {
  const [mode, setMode] = useState<Mode>('signIn');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [focused, setFocused] = useState<Field | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState<boolean>(false);
 
  const passwordRef = useRef<TextInput>(null);
  const copy = COPY[mode];
 
  const fieldStyle = (field: Field) => [
    styles.field,
    focused === field && styles.fieldFocused,
    errors[field] ? styles.fieldError : null,
  ];
 
  const switchMode = (): void => {
    setMode((m) => (m === 'signIn' ? 'signUp' : 'signIn'));
    setErrors({});
    setShowPassword(false);
  };
 
  const submit = async (): Promise<void> => {
    const next: Errors = {};
    if (!EMAIL_PATTERN.test(email.trim())) {
      next.email = 'Enter a valid email address.';
    }
    if (mode === 'signUp' && password.length < MIN_PASSWORD) {
      next.password = `Use at least ${MIN_PASSWORD} characters.`;
    } else if (password.length === 0) {
      next.password = 'Enter your password.';
    }
    setErrors(next);
    if (next.email || next.password) return;
 
    setLoading(true);
    try {
      // call supabase auth here
      // later issue probably
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.wordmark}>LabDog</Text>
          <Text style={styles.subheader}>Your Medical Report Guide</Text>
        </View>
 
        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            <Text style={styles.title}>{copy.title}</Text>
            <Text style={styles.blurb}>{copy.blurb}</Text>
 
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={fieldStyle('email')}>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
                  }}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  placeholder="you@example.com"
                  placeholderTextColor={PLACEHOLDER}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  accessibilityLabel="Email"
                />
              </View>
              {errors.email ? (
                <Text style={styles.errorText} accessibilityRole="alert">
                  {errors.email}
                </Text>
              ) : null}
            </View>
 
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={fieldStyle('password')}>
                <TextInput
                  ref={passwordRef}
                  style={styles.input}
                  value={password}
                  onChangeText={(t) => {
                    setPassword(t);
                    if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
                  }}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  placeholder={mode === 'signUp' ? `At least ${MIN_PASSWORD} characters` : 'Your password'}
                  placeholderTextColor={PLACEHOLDER}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete={mode === 'signUp' ? 'password-new' : 'current-password'}
                  textContentType={mode === 'signUp' ? 'newPassword' : 'password'}
                  returnKeyType="go"
                  onSubmitEditing={submit}
                  accessibilityLabel="Password"
                />
                <TouchableOpacity
                  style={styles.toggle}
                  onPress={() => setShowPassword((s) => !s)}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 8 }}
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                >
                  <Text style={styles.toggleText}>{showPassword ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
              </View>
              {errors.password ? (
                <Text style={styles.errorText} accessibilityRole="alert">
                  {errors.password}
                </Text>
              ) : null}
            </View>
 
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              activeOpacity={0.85}
              onPress={submit}
              disabled={loading}
              accessibilityRole="button"
              accessibilityState={{ disabled: loading, busy: loading }}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>{copy.button}</Text>
              )}
            </TouchableOpacity>
 
            <View style={styles.footer}>
              <Text style={styles.footerText}>{copy.prompt}</Text>
              <TouchableOpacity onPress={switchMode} accessibilityRole="button">
                <Text style={styles.footerLink}>{copy.switchTo}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}