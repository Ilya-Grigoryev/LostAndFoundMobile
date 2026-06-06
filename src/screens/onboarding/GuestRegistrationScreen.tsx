import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { Button, TextInput } from '../../components/ui';
import { useLocalization } from '../../contexts/LocalizationContext';
import { colors, spacing, typography } from '../../theme';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function GuestRegistrationScreen() {
  const navigation = useNavigation();
  const { t } = useLocalization();
  const [studentGuestName, setStudentGuestName] = useState('');
  const [studentGuestEmail, setStudentGuestEmail] = useState('');
  const [nameProblemText, setNameProblemText] = useState('');
  const [emailProblemText, setEmailProblemText] = useState('');
  const [guestSaveProblemText, setGuestSaveProblemText] = useState('');
  const [guestIsSaving, setGuestIsSaving] = useState(false);

  const finish = async () => {
    const cleanGuestName = studentGuestName.trim();
    const cleanGuestEmail = studentGuestEmail.trim();
    let formHasProblem = false;

    setNameProblemText('');
    setEmailProblemText('');
    setGuestSaveProblemText('');

    if (!cleanGuestName) {
      setNameProblemText(t('onboarding.guest.nameError'));
      formHasProblem = true;
    }

    if (!emailPattern.test(cleanGuestEmail)) {
      setEmailProblemText(t('onboarding.guest.emailError'));
      formHasProblem = true;
    }

    if (formHasProblem) {
      return;
    }

    setGuestIsSaving(true);

    try {
      await AsyncStorage.multiSet([
        ['@guest_name', cleanGuestName],
        ['@guest_email', cleanGuestEmail],
        ['@onboarding_complete', 'true'],
      ]);
      navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Main' }] }));
    } catch {
      setGuestSaveProblemText(t('onboarding.guest.saveError'));
    } finally {
      setGuestIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={[typography.h2, styles.title]}>{t('onboarding.guest.title')}</Text>
        <Text style={[typography.body, styles.subtitle]}>{t('onboarding.guest.subtitle')}</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          label={t('onboarding.guest.nameLabel')}
          placeholder={t('onboarding.guest.namePlaceholder')}
          value={studentGuestName}
          onChangeText={setStudentGuestName}
          error={nameProblemText}
          autoCapitalize="words"
          returnKeyType="next"
        />
        <TextInput
          label={t('onboarding.guest.emailLabel')}
          placeholder={t('onboarding.guest.emailPlaceholder')}
          value={studentGuestEmail}
          onChangeText={setStudentGuestEmail}
          error={emailProblemText}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          returnKeyType="done"
        />
      </View>

      {guestSaveProblemText && <Text style={styles.error}>{guestSaveProblemText}</Text>}

      <Button label={t('onboarding.guest.button')} onPress={finish} loading={guestIsSaving} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.screenMargin,
    backgroundColor: colors.background,
  },
  header: {
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  title: {
    color: colors.textPrimary,
  },
  subtitle: {
    color: colors.textSecondary,
  },
  form: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  error: {
    ...typography.caption,
    color: colors.error,
    marginBottom: spacing.md,
  },
});
