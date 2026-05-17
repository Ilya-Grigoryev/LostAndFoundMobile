import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, ScreenHeader } from '../../components/ui';
import { GeoSquare } from '../../components/ui/Geo';
import CodeBoxes from '../../components/fundbox/CodeBoxes';
import { fundboxes } from '../../constants/fundboxes';
import { useLocalization } from '../../contexts/LocalizationContext';
import { FundboxStackParamList } from '../../navigation/types';
import { getFundboxById } from '../../services/fundboxService';
import { colors, spacing, typography } from '../../theme';

type Nav = NativeStackNavigationProp<FundboxStackParamList, 'Claim'>;
type ClaimRoute = RouteProp<FundboxStackParamList, 'Claim'>;

export default function ClaimScreen() {
  const nav = useNavigation<Nav>();
  const { params } = useRoute<ClaimRoute>();
  const { t } = useLocalization();
  const [code, setCode] = useState('');

  const matchFundbox = params?.fundboxId ? getFundboxById(params.fundboxId) ?? fundboxes[0] : fundboxes[0];
  const matchCategory = params?.categoryLabel ?? 'Gegenstand';
  const droppedAtLabel = params?.droppedAtLabel ?? 'Heute';
  const canConfirm = code.replace(/\D/g, '').length === 6;

  return (
    <View style={styles.root}>
      <ScreenHeader
        title={t('fundbox.claim.title')}
        onBack={() => nav.goBack()}
        accentColor={colors.loserPrimary}
      />

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <View style={styles.matchCard}>
          <View style={styles.matchInfo}>
            <Text style={[typography.label, styles.eyebrow]}>{t('fundbox.claim.eyebrow')}</Text>
            <Text style={[typography.h2, styles.matchTitle]}>{matchCategory}</Text>
            <Text style={[typography.caption, styles.matchMeta]} numberOfLines={2}>
              {matchFundbox.name}
            </Text>
            <Text style={[typography.caption, styles.matchMeta]}>
              {t('fundbox.claim.foundAt')} · {droppedAtLabel}
            </Text>
          </View>
          <View style={styles.matchPhoto}>
            <GeoSquare size={28} color={colors.loserPrimary} />
          </View>
        </View>

        <View style={styles.inputBlock}>
          <Text style={[typography.label, styles.eyebrowDark]}>{t('fundbox.claim.codePrompt')}</Text>
          <CodeBoxes value={code} onChange={setCode} />
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <Button
          label={t('fundbox.claim.confirmCta')}
          color={colors.loserPrimary}
          onPress={() => nav.replace('ClaimSuccess')}
          disabled={!canConfirm}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  body: {
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.xl,
  },
  matchCard: {
    flexDirection: 'row',
    backgroundColor: colors.loserLight,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: spacing.md,
  },
  matchInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  eyebrow: {
    color: colors.loserPressed,
  },
  eyebrowDark: {
    color: colors.textSecondary,
  },
  matchTitle: {
    color: colors.textPrimary,
  },
  matchMeta: {
    color: colors.textSecondary,
  },
  matchPhoto: {
    width: 96,
    height: 96,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputBlock: {
    gap: spacing.md,
  },
  bottom: {
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1.5,
    borderTopColor: colors.border,
  },
});
