import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { Card, LoadingSpinner } from '../../components/ui';
import { Language } from '../../constants/strings';
import { useLocalization } from '../../contexts/LocalizationContext';
import { OnboardingStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';

type Nav = NativeStackNavigationProp<OnboardingStackParamList, 'LanguagePicker'>;

export default function LanguagePickerScreen() {
  const navigation = useNavigation<Nav>();
  const { language, loading, setLanguage, t } = useLocalization();
  const [languageSavingNow, setLanguageSavingNow] = useState<Language | null>(null);
  const [showLanguageSaveProblem, setShowLanguageSaveProblem] = useState(false);

  const chooseLanguage = async (pickedLanguage: Language) => {
    setLanguageSavingNow(pickedLanguage);
    setShowLanguageSaveProblem(false);

    try {
      await setLanguage(pickedLanguage);
      navigation.navigate('GuestRegistration');
    } catch {
      setShowLanguageSaveProblem(true);
    } finally {
      setLanguageSavingNow(null);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[typography.h2, styles.title]}>{t('onboarding.language.title')}</Text>
        <Text style={[typography.body, styles.subtitle]}>{t('onboarding.language.subtitle')}</Text>
      </View>

      <View style={styles.options}>
        <LanguageOption
          label={t('onboarding.language.german')}
          selected={language === 'de'}
          disabled={languageSavingNow !== null}
          loading={languageSavingNow === 'de'}
          onPress={() => chooseLanguage('de')}
        />
        <LanguageOption
          label={t('onboarding.language.english')}
          selected={language === 'en'}
          disabled={languageSavingNow !== null}
          loading={languageSavingNow === 'en'}
          onPress={() => chooseLanguage('en')}
        />
      </View>

      {showLanguageSaveProblem && <Text style={styles.error}>{t('onboarding.language.error')}</Text>}
    </View>
  );
}

function LanguageOption({
  label,
  selected,
  disabled,
  loading,
  onPress,
}: {
  label: string;
  selected: boolean;
  disabled: boolean;
  loading: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled }}
    >
      <Card bordered style={[styles.option, selected && styles.selectedOption]}>
        <Text style={[typography.h3, styles.optionText]}>{loading ? '...' : label}</Text>
      </Card>
    </Pressable>
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
  options: {
    gap: spacing.md,
  },
  option: {
    minHeight: spacing.xxl * 2,
    justifyContent: 'center',
  },
  selectedOption: {
    backgroundColor: colors.accentLight,
  },
  optionText: {
    color: colors.textPrimary,
  },
  error: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.md,
  },
});
