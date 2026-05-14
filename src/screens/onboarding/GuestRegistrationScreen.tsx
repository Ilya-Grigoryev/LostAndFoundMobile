import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/ui';
import { colors, spacing, typography } from '../../theme';

// Stub — Denis replaces in feature/onboarding (Phase 3)
export default function GuestRegistrationScreen() {
  const navigation = useNavigation();

  const finish = async () => {
    await AsyncStorage.setItem('@onboarding_complete', 'true');
    navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Main' }] }));
  };

  return (
    <View style={styles.container}>
      <Text style={[typography.h2, styles.title]}>Registrierung</Text>
      <Button label="Als Gast weiter" onPress={finish} />
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
