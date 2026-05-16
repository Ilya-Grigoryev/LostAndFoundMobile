import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, ScreenHeader } from '../../components/ui';
import { GeoSquare } from '../../components/ui/Geo';
import ProgressDots from '../../components/ui/ProgressDots';
import { useLocalization } from '../../contexts/LocalizationContext';
import { generateVerificationCode, getFundboxById, saveCode } from '../../services/fundboxService';
import { runDropOffMatchingDemo } from '../../services/matchingService';
import { FundboxStackParamList } from '../../navigation/types';
import { colors, fontFamily, spacing, typography } from '../../theme';

type Nav = NativeStackNavigationProp<FundboxStackParamList, 'DropOff'>;
type DropOffRouteProp = RouteProp<FundboxStackParamList, 'DropOff'>;

export default function DropOffConfirmScreen() {
  const nav = useNavigation<Nav>();
  const { params } = useRoute<DropOffRouteProp>();
  const { t } = useLocalization();

  const fundbox = getFundboxById(params.fundboxId);
  if (!fundbox) {
    nav.goBack();
    return null;
  }

  const [itemChecked, setItemChecked] = useState(false);
  const [closedChecked, setClosedChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const bothChecked = itemChecked && closedChecked;

  const confirm = async () => {
    if (!bothChecked || submitting) return;
    setSubmitting(true);
    const code = generateVerificationCode();
    await saveCode(fundbox.id, code);
    runDropOffMatchingDemo(fundbox.id).catch(() => undefined);
    nav.replace('DropOffSuccess', { fundboxId: fundbox.id });
  };

  return (
    <View style={styles.root}>
      <ScreenHeader
        title={t('fundbox.dropoff.title')}
        onBack={() => nav.goBack()}
        accentColor={colors.finderPrimary}
        rightAction={<ProgressDots total={4} current={3} />}
      />

      <View style={styles.body}>
        <View style={styles.recap}>
          <View style={styles.recapPhoto}>
            <GeoSquare size={24} color={colors.finderPrimary} />
          </View>
          <View style={styles.recapText}>
            <Text style={[typography.label, styles.eyebrow]}>{t('fundbox.dropoff.recapEyebrow')}</Text>
            <Text style={[typography.h3, styles.recapTitle]} numberOfLines={1}>
              {fundbox.name.split(' · ')[0]}
            </Text>
            <Text style={[typography.caption, styles.recapMeta]} numberOfLines={2}>
              {fundbox.address}
            </Text>
          </View>
        </View>

        <View style={styles.checks}>
          <CheckBlock
            index="1"
            label={t('fundbox.dropoff.checkItem')}
            checked={itemChecked}
            onToggle={() => setItemChecked(v => !v)}
          />
          <CheckBlock
            index="2"
            label={t('fundbox.dropoff.checkClosed')}
            checked={closedChecked}
            onToggle={() => setClosedChecked(v => !v)}
          />
        </View>
      </View>

      <View style={styles.bottom}>
        <Button
          label={t('fundbox.dropoff.confirmCta')}
          color={colors.finderPrimary}
          onPress={confirm}
          disabled={!bothChecked}
          loading={submitting}
        />
      </View>
    </View>
  );
}

function CheckBlock({
  index,
  label,
  checked,
  onToggle,
}: {
  index: string;
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 0 }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onToggle}
        onPressIn={pressIn}
        onPressOut={pressOut}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        accessibilityLabel={label}
        style={[styles.checkRow, checked && styles.checkRowActive]}
      >
        <Text style={[styles.indexText, checked && styles.indexTextActive]}>{index}</Text>
        <Text style={[styles.checkLabel, checked && styles.checkLabelActive]}>{label}</Text>
        <View style={[styles.checkBox, checked && styles.checkBoxActive]}>
          {checked && <Text style={styles.checkMark}>✕</Text>}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },
  recap: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.sageSoft,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
  },
  recapPhoto: {
    width: 64,
    height: 64,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recapText: {
    flex: 1,
    gap: 2,
  },
  eyebrow: {
    color: colors.textSecondary,
  },
  recapTitle: {
    color: colors.textPrimary,
  },
  recapMeta: {
    color: colors.textSecondary,
  },
  checks: {
    gap: spacing.md,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 88,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  checkRowActive: {
    backgroundColor: colors.finderLight,
    borderColor: colors.accent,
  },
  indexText: {
    fontFamily: fontFamily.display,
    fontSize: 36,
    lineHeight: 36,
    letterSpacing: -2,
    color: colors.borderSubtle,
    width: 32,
  },
  indexTextActive: {
    color: colors.accent,
  },
  checkLabel: {
    flex: 1,
    fontFamily: fontFamily.bodyBold,
    fontSize: 16,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  checkLabelActive: {
    color: colors.textPrimary,
  },
  checkBox: {
    width: 32,
    height: 32,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBoxActive: {
    backgroundColor: colors.finderPrimary,
    borderColor: colors.accent,
  },
  checkMark: {
    fontFamily: fontFamily.bodyBlack,
    fontSize: 18,
    color: colors.accent,
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
