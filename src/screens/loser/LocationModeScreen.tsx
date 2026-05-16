import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { Button, ScreenHeader } from '../../components/ui';
import { useLocalization } from '../../contexts/LocalizationContext';
import { LoserStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';

type Nav = NativeStackNavigationProp<LoserStackParamList, 'LocationMode'>;

export default function LocationModeScreen() {
  const nav = useNavigation<Nav>();
  const { t } = useLocalization();

  return (
    <View style={styles.root}>
      <ScreenHeader
        title={t('loser.mode.title')}
        onBack={() => nav.goBack()}
        accentColor={colors.loserPrimary}
      />
      <View style={styles.body}>
        <Text style={typography.body}>Location mode (stub)</Text>
        <Button label="Map" color={colors.loserPrimary} onPress={() => nav.navigate('LocationMap')} />
        <Button label="Address" variant="secondary" color={colors.loserPrimary} onPress={() => nav.navigate('LocationAddress')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  body: { flex: 1, padding: spacing.screenMargin, gap: spacing.md, justifyContent: 'center' },
});
