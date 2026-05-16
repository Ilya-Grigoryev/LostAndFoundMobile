import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { Button, ScreenHeader } from '../../components/ui';
import { useLocalization } from '../../contexts/LocalizationContext';
import { LoserStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';

type Nav = NativeStackNavigationProp<LoserStackParamList, 'Confirm'>;

export default function LoserConfirmScreen() {
  const nav = useNavigation<Nav>();
  const { t } = useLocalization();

  return (
    <View style={styles.root}>
      <ScreenHeader
        title={t('loser.confirm.title')}
        onBack={() => nav.goBack()}
        accentColor={colors.loserPrimary}
      />
      <View style={styles.body}>
        <Text style={typography.body}>Confirm (stub)</Text>
        <Button label={t('loser.confirm.cta')} color={colors.loserPrimary} onPress={() => nav.navigate('Success')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  body: { flex: 1, padding: spacing.screenMargin, gap: spacing.md, justifyContent: 'center' },
});
