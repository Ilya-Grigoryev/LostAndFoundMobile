import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/ui';
import { useLocalization } from '../../contexts/LocalizationContext';
import { LoserStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';

type Nav = NativeStackNavigationProp<LoserStackParamList, 'Success'>;

export default function LoserSuccessScreen() {
  const nav = useNavigation<Nav>();
  const { t } = useLocalization();

  return (
    <View style={styles.root}>
      <Text style={typography.h2}>{t('loser.success.hero')}</Text>
      <Button label={t('loser.success.home')} variant="ghost" color={colors.loserPrimary} onPress={() => nav.getParent()?.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, padding: spacing.screenMargin, justifyContent: 'center', gap: spacing.md },
});
