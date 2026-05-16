import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  View,
} from 'react-native';
import CategoryTile from '../../components/location/CategoryTile';
import DescriptionField from '../../components/location/DescriptionField';
import { Button, ScreenHeader } from '../../components/ui';
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
  const { category, description: ctxDescription, setCategory } = useLoserReport();

  const [selected, setSelected] = useState<CategoryId | null>(category);
  const [description, setDescription] = useState<string>(ctxDescription ?? '');
  const descriptionRef = useRef<RNTextInput>(null);
  const scrollRef = useRef<ScrollView>(null);

  const otherSelected = selected === 'other';
  const trimmedDescription = description.trim();
  const canContinue =
    selected !== null && (!otherSelected || trimmedDescription.length > 0);

  const handlePick = (id: CategoryId) => {
    setSelected(id);
    if (id === 'other') {
      // Sonstiges turns the description into a required field — scroll back to
      // it and pop the keyboard so the user knows what to do next.
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ y: 0, animated: true });
        descriptionRef.current?.focus();
      });
    }
  };

  const handleContinue = () => {
    if (!canContinue || !selected) return;
    setCategory(selected, trimmedDescription || undefined);
    nav.navigate('LocationMode');
  };

  // 6 specific categories form a 2-col grid; "other" stretches full width below.
  const grid = categories.filter(c => c.id !== 'other');
  const other = categories.find(c => c.id === 'other')!;

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader
        title=" "
        onBack={() => nav.getParent()?.goBack()}
        accentColor={colors.loserPrimary}
      />

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.heading}>
          <Text style={[typography.label, styles.eyebrow]}>
            01 — {t('loser.category.title').toUpperCase()}
          </Text>
          <Text style={styles.title}>{t('loser.category.title')}</Text>
          <Text style={[typography.body, styles.subtitle]}>
            {t('loser.category.subtitle')}
          </Text>
        </View>

        <DescriptionField
          ref={descriptionRef}
          label={t('loser.description.eyebrow').toUpperCase()}
          meta={
            otherSelected
              ? t('loser.description.required')
              : t('loser.description.optional')
          }
          emphasizeMeta={otherSelected}
          placeholder={t('loser.description.placeholder')}
          value={description}
          onChangeText={setDescription}
        />

        <View style={styles.gridSection}>
          <Text style={[typography.label, styles.sectionEyebrow]}>
            02 — {t('loser.category.eyebrow').toUpperCase()}
          </Text>
          <View style={styles.grid}>
            {grid.map(c => (
              <CategoryTile
                key={c.id}
                id={c.id}
                label={t(c.labelKey)}
                tint={c.tint}
                selected={selected === c.id}
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
        </View>
      </ScrollView>

      <View style={styles.cta}>
        <Button
          label={t('loser.category.cta')}
          color={colors.loserPrimary}
          disabled={!canContinue}
          onPress={handleContinue}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: {
    paddingHorizontal: spacing.screenMargin,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  heading: {
    paddingTop: spacing.md,
    gap: spacing.xs,
  },
  eyebrow: {
    color: colors.loserPrimary,
    letterSpacing: 2.8,
  },
  title: {
    fontFamily: fontFamily.display,
    fontSize: 38,
    lineHeight: 40,
    letterSpacing: -1.8,
    color: colors.textPrimary,
  },
  subtitle: {
    color: colors.textSecondary,
    paddingRight: spacing.lg,
  },
  gridSection: { gap: spacing.sm },
  sectionEyebrow: {
    color: colors.textSecondary,
    letterSpacing: 2.8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  cta: {
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1.5,
    borderTopColor: colors.border,
  },
});
