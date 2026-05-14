import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/ui';
import { OnboardingStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';

// Stub — Denis replaces in feature/onboarding (Phase 3)
type Nav = NativeStackNavigationProp<OnboardingStackParamList, 'LanguagePicker'>;

export default function LanguagePickerScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <View style={styles.container}>
      <Text style={[typography.h2, styles.title]}>Sprache / Language</Text>
      <Button label="Continue →" onPress={() => navigation.navigate('GuestRegistration')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.screenMargin,
    backgroundColor: colors.background,
  },
  title: {
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
});
