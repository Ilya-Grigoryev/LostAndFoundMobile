import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CategoryTile from '../../components/location/CategoryTile';
import { Button, ScreenHeader, TextInput } from '../../components/ui';
import { categories } from '../../constants/categories';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useLoserReport } from '../../contexts/LoserReportContext';
import { LoserStackParamList } from '../../navigation/types';
import { CategoryId } from '../../types/loser';
import { colors, fontFamily, spacing, typography } from '../../theme';

type Nav = NativeStackNavigationProp<LoserStackParamList, 'Category'>;

export default function CategoryScreen() {
  const nav = useNavigation<Nav>();
  const { t } = useLocalization();
  const { category, customLabel, setCategory } = useLoserReport();

  // Track the "other" path locally so the input + CTA only appear after the
  // tile is tapped. Stays sticky across re-renders via context defaults.
  const [otherSelected, setOtherSelected] = useState<boolean>(category === 'other');
  const [otherText, setOtherText] = useState<string>(customLabel ?? '');

  const handlePick = (id: CategoryId) => {
    if (id === 'other') {
      setOtherSelected(true);
      return;
    }
    setOtherSelected(false);
    setCategory(id);
    nav.navigate('LocationMode');
  };

  const handleConfirmOther = () => {
    const trimmed = otherText.trim();
    if (!trimmed) return;
    setCategory('other', trimmed);
    nav.navigate('LocationMode');
  };

  // 6 specific categories form a 2-col grid; "other" stretches full width below.
  const grid = categories.filter(c => c.id !== 'other');
  const other = categories.find(c => c.id === 'other')!;

  return (
    <View style={styles.root}>
      <ScreenHeader
        title=" "
        onBack={() => nav.getParent()?.goBack()}
        accentColor={colors.loserPrimary}
      />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.heading}>
          <Text style={[typography.label, styles.eyebrow]}>01 — {t('loser.category.title').toUpperCase()}</Text>
          <Text style={styles.title}>{t('loser.category.title')}</Text>
          <Text style={[typography.body, styles.subtitle]}>{t('loser.category.subtitle')}</Text>
        </View>

        <View style={styles.grid}>
          {grid.map(c => (
            <CategoryTile
              key={c.id}
              id={c.id}
              label={t(c.labelKey)}
              tint={c.tint}
              selected={category === c.id && !otherSelected}
              onPress={() => handlePick(c.id)}
            />
          ))}
          <CategoryTile
            id={other.id}
            label={t(other.labelKey)}
            tint={other.tint}
            selected={otherSelected}
            fullWidth
            onPress={() => handlePick(other.id)}
          />
        </View>

        {otherSelected && (
          <View style={styles.otherPanel}>
            <TextInput
              label={t('loser.category.otherLabel')}
              placeholder={t('loser.category.otherPlaceholder')}
              value={otherText}
              onChangeText={setOtherText}
              accentColor={colors.loserPrimary}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleConfirmOther}
            />
            <Button
              label={t('loser.category.otherCta')}
              color={colors.loserPrimary}
              disabled={otherText.trim().length === 0}
              onPress={handleConfirmOther}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: {
    paddingHorizontal: spacing.screenMargin,
    paddingBottom: spacing.xl,
  },
  heading: {
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  eyebrow: {
    color: colors.loserPrimary,
    letterSpacing: 2.8,
  },
  title: {
    fontFamily: fontFamily.display,
    fontSize: 42,
    lineHeight: 44,
    letterSpacing: -2,
    color: colors.textPrimary,
  },
  subtitle: {
    color: colors.textSecondary,
    paddingRight: spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  otherPanel: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
});
