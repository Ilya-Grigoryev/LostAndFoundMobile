import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TextInput } from '../../components/ui';
import { useLocalization } from '../../contexts/LocalizationContext';
import { Bezirk, viennaBezirke } from '../../constants/viennaBezirke';
import { colors, fontFamily, spacing, typography } from '../../theme';

interface StepByStepValue {
  bezirk: number;
  street?: string;
  landmark?: string;
}

interface StepByStepModeProps {
  initial?: StepByStepValue;
  onChange: (value: StepByStepValue | null) => void;
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

export default function StepByStepMode({ initial, onChange }: StepByStepModeProps) {
  const { t } = useLocalization();
  const [bezirk, setBezirk] = useState<Bezirk | null>(
    initial ? viennaBezirke.find(b => b.number === initial.bezirk) ?? null : null,
  );
  const [street, setStreet] = useState<string | undefined>(initial?.street);
  const [landmark, setLandmark] = useState<string>(initial?.landmark ?? '');

  useEffect(() => {
    if (!bezirk) {
      onChange(null);
      return;
    }
    onChange({
      bezirk: bezirk.number,
      street: street || undefined,
      landmark: landmark.trim() || undefined,
    });
  }, [bezirk, street, landmark, onChange]);

  if (!bezirk) {
    return (
      <View style={styles.root}>
        <Text style={[typography.label, styles.eyebrow]}>{t('loser.steps.pickBezirk')}</Text>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          {viennaBezirke.map(b => (
            <Pressable
              key={b.number}
              onPress={() => setBezirk(b)}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              accessibilityRole="button"
              accessibilityLabel={`${b.number}. ${b.name}`}
            >
              <Text style={styles.number}>{pad(b.number)}</Text>
              <Text style={styles.rowName}>{b.name}</Text>
              <Text style={styles.arrow}>→</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.breadcrumb}>
        <Pressable onPress={() => { setBezirk(null); setStreet(undefined); }} hitSlop={8}>
          <Text style={[typography.label, styles.crumbBack]}>← {t('loser.steps.pickBezirk').toUpperCase()}</Text>
        </Pressable>
        <Text style={styles.crumb}>{pad(bezirk.number)} · {bezirk.name.toUpperCase()}{street ? ` › ${street.toUpperCase()}` : ''}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.detailBody}>
        <Text style={[typography.label, styles.eyebrow]}>{t('loser.steps.pickStreet')}</Text>
        <View style={styles.streetList}>
          {bezirk.sampleStreets.map(s => {
            const active = s === street;
            return (
              <Pressable
                key={s}
                onPress={() => setStreet(active ? undefined : s)}
                style={[styles.streetRow, active && styles.streetRowActive]}
              >
                <Text style={[styles.streetLabel, active && styles.streetLabelActive]}>{s}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.landmarkWrap}>
          <TextInput
            label={t('loser.steps.landmarkLabel')}
            placeholder={t('loser.steps.landmarkPlaceholder')}
            value={landmark}
            onChangeText={setLandmark}
            accentColor={colors.loserPrimary}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  eyebrow: {
    color: colors.loserPrimary,
    letterSpacing: 2.4,
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  list: { paddingBottom: spacing.lg },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.screenMargin,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    gap: spacing.md,
  },
  rowPressed: { backgroundColor: colors.loserLight },
  number: {
    fontFamily: fontFamily.display,
    fontSize: 32,
    lineHeight: 32,
    letterSpacing: -1.2,
    color: colors.loserPrimary,
    minWidth: 50,
  },
  rowName: {
    flex: 1,
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  arrow: {
    fontFamily: fontFamily.body,
    fontSize: 18,
    color: colors.textSecondary,
  },
  breadcrumb: {
    paddingHorizontal: spacing.screenMargin,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.border,
    gap: 4,
    backgroundColor: colors.surface,
  },
  crumbBack: { color: colors.loserPrimary, letterSpacing: 2 },
  crumb: { ...typography.caption, color: colors.textPrimary, letterSpacing: 1.4 },
  detailBody: { paddingBottom: spacing.xl },
  streetList: {
    paddingHorizontal: spacing.screenMargin,
    gap: spacing.xs,
  },
  streetRow: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  streetRowActive: { backgroundColor: colors.loserPrimary, borderColor: colors.loserPrimary },
  streetLabel: { ...typography.bodyBold, color: colors.textPrimary },
  streetLabelActive: { color: colors.textOnLoser },
  landmarkWrap: {
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.lg,
  },
});
