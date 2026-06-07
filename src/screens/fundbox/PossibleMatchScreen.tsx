import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
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
  const photoUri = params?.photoUri;
  const description = params?.description;
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
        accentColor={colors.loserPrimary}
      />

      <ScrollView contentContainerStyle={styles.body}>
        {/* Real finder photo when available, otherwise a clearly labelled placeholder. */}
        <View style={styles.photo}>
          {photoUri ? (
            <>
              <Image source={{ uri: photoUri }} style={styles.photoImage} resizeMode="cover" />
              <Text style={[typography.label, styles.photoCaption]}>
                {t('possibleMatch.photoCaption')}
              </Text>
            </>
          ) : (
            <View style={styles.photoPlaceholder}>
              <GeoSquare size={42} color={colors.loserPrimary} />
              <Text style={[typography.caption, styles.photoMissing]}>
                {t('possibleMatch.photoMissing')}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={[typography.label, styles.eyebrow]}>{t('possibleMatch.eyebrow')}</Text>
          <Text style={[typography.h2, styles.title]}>{categoryLabel}</Text>
          <Text style={[typography.body, styles.bodyText]}>{t('possibleMatch.body')}</Text>
        </View>

        <View style={styles.detailBox}>
          <DetailLine
            label={t('possibleMatch.description')}
            value={description || t('possibleMatch.descriptionFallback')}
          />
          <DetailLine label={t('possibleMatch.place')} value={placeLabel} />
          {addressLabel ? (
            <DetailLine label={t('possibleMatch.address')} value={addressLabel} />
          ) : null}
          {params?.droppedAtLabel ? (
            <DetailLine label={t('possibleMatch.foundAt')} value={params.droppedAtLabel} />
          ) : null}
        </View>

        {/* Set expectations for the pickup-code step that follows for Fundbox matches (ISSUE-04). */}
        {matchPlace === 'fundbox' ? (
          <Text style={[typography.caption, styles.nextStep]}>
            {t('possibleMatch.nextStepFundbox')}
          </Text>
        ) : null}
      </ScrollView>

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
    padding: spacing.screenMargin,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.loserLight,
    borderWidth: 1.5,
    borderColor: colors.loserPrimary,
    padding: spacing.md,
    gap: spacing.xs,
  },
  photo: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  photoImage: {
    width: '100%',
    height: 220,
  },
  photoPlaceholder: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  photoMissing: {
    color: colors.textSecondary,
  },
  photoCaption: {
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1.5,
    borderTopColor: colors.borderSubtle,
  },
  eyebrow: {
    color: colors.loserPressed,
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
  nextStep: {
    color: colors.textSecondary,
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
