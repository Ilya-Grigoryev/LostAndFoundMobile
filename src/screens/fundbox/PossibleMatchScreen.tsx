import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { Button, ScreenHeader } from '../../components/ui';
import { GeoSquare } from '../../components/ui/Geo';
import { fundboxes } from '../../constants/fundboxes';
import { useLocalization } from '../../contexts/LocalizationContext';
import { FundboxStackParamList } from '../../navigation/types';
import { getFundboxById } from '../../services/fundboxService';
import { colors, spacing, typography } from '../../theme';

type Nav = NativeStackNavigationProp<FundboxStackParamList, 'PossibleMatch'>;
type PossibleMatchRoute = RouteProp<FundboxStackParamList, 'PossibleMatch'>;

export default function PossibleMatchScreen() {
  const nav = useNavigation<Nav>();
  const { params } = useRoute<PossibleMatchRoute>();
  const { t } = useLocalization();

  const matchPlace = params?.matchPlace ?? 'fundbox';
  const categoryLabel = params?.categoryLabel ?? t('matching.itemFallback');
  const fundbox = params?.fundboxId ? getFundboxById(params.fundboxId) ?? fundboxes[0] : fundboxes[0];
  const placeLabel =
    matchPlace === 'city'
      ? params?.placeLabel ?? t('matching.cityFallbackPlace')
      : fundbox.name;
  const addressLabel =
    matchPlace === 'city'
      ? params?.addressLabel
      : fundbox.address;

  const confirmMatch = () => {
    if (matchPlace === 'city') {
      nav.replace('MatchLocation', {
        categoryLabel,
        placeLabel,
        addressLabel,
        latitude: params?.latitude,
        longitude: params?.longitude,
      });
      return;
    }

    nav.replace('MatchFundboxRoute', {
      fundboxId: fundbox.id,
      categoryLabel,
    });
  };

  const rejectMatch = () => {
    nav.getParent()?.goBack();
  };

  return (
    <View style={styles.root}>
      <ScreenHeader
        title={t('possibleMatch.title')}
        onBack={() => nav.goBack()}
        accentColor={colors.finderPrimary}
      />

      <View style={styles.body}>
        <View style={styles.card}>
          <View style={styles.photo}>
            <GeoSquare size={42} color={colors.finderPrimary} />
          </View>
          <View style={styles.info}>
            <Text style={[typography.label, styles.eyebrow]}>{t('possibleMatch.eyebrow')}</Text>
            <Text style={[typography.h2, styles.title]}>{categoryLabel}</Text>
            <Text style={[typography.body, styles.bodyText]}>{t('possibleMatch.body')}</Text>
          </View>
        </View>

        <View style={styles.detailBox}>
          <DetailLine label={t('possibleMatch.place')} value={placeLabel} />
          {addressLabel ? (
            <DetailLine label={t('possibleMatch.address')} value={addressLabel} />
          ) : null}
          {params?.droppedAtLabel ? (
            <DetailLine label={t('possibleMatch.foundAt')} value={params.droppedAtLabel} />
          ) : null}
        </View>
      </View>

      <View style={styles.bottom}>
        <Button
          label={t('possibleMatch.confirmCta')}
          color={colors.loserPrimary}
          onPress={confirmMatch}
        />
        <Button
          label={t('possibleMatch.rejectCta')}
          variant="secondary"
          color={colors.accent}
          onPress={rejectMatch}
        />
      </View>
    </View>
  );
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailLine}>
      <Text style={[typography.label, styles.detailLabel]}>{label}</Text>
      <Text style={[typography.bodyBold, styles.detailValue]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  body: {
    flex: 1,
    padding: spacing.screenMargin,
    gap: spacing.md,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.finderLight,
    borderWidth: 1.5,
    borderColor: colors.finderPrimary,
    padding: spacing.md,
    gap: spacing.md,
  },
  photo: {
    width: 96,
    height: 96,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  eyebrow: {
    color: colors.finderPressed,
  },
  title: {
    color: colors.textPrimary,
  },
  bodyText: {
    color: colors.textSecondary,
  },
  detailBox: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  detailLine: {
    padding: spacing.md,
    gap: spacing.xs,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.borderSubtle,
  },
  detailLabel: {
    color: colors.textSecondary,
  },
  detailValue: {
    color: colors.textPrimary,
  },
  bottom: {
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
    backgroundColor: colors.background,
    borderTopWidth: 1.5,
    borderTopColor: colors.border,
  },
});
