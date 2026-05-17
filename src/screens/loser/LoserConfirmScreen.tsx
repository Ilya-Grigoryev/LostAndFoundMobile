import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import CategoryIcon from '../../components/location/CategoryIcon';
import LocationPreview from '../../components/location/LocationPreview';
import { Button, ErrorState, ProgressDots, ScreenHeader } from '../../components/ui';
import { getCategoryMeta } from '../../constants/categories';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useLoserReport } from '../../contexts/LoserReportContext';
import { saveLostReport } from '../../services/loserReportService';
import { LoserStackParamList } from '../../navigation/types';
import { colors, fontFamily, spacing, typography } from '../../theme';

type Nav = NativeStackNavigationProp<LoserStackParamList, 'Confirm'>;

function PushToggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  const translateX = useRef(new Animated.Value(value ? 28 : 0)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: value ? 28 : 0,
      useNativeDriver: true,
      speed: 18,
      bounciness: 6,
    }).start();
  }, [value, translateX]);

  return (
    <Pressable
      onPress={() => onChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      style={[styles.toggle, { backgroundColor: value ? colors.loserPrimary : colors.surface }]}
    >
      <Animated.View
        style={[
          styles.thumb,
          {
            backgroundColor: value ? colors.surface : colors.loserPrimary,
            transform: [{ translateX }],
          },
        ]}
      />
    </Pressable>
  );
}

export default function LoserConfirmScreen() {
  const nav = useNavigation<Nav>();
  const { t } = useLocalization();
  const { category, description, location, pushOptIn, setPushOptIn } = useLoserReport();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!category || !location) {
    return (
      <View style={styles.root}>
        <ScreenHeader
          title={t('loser.flow.title')}
          onBack={() => nav.goBack()}
          accentColor={colors.loserPrimary}
          rightAction={<ProgressDots total={4} current={4} activeColor={colors.loserPrimary} />}
        />
        <ErrorState
          message={t('loser.confirm.saveError')}
          onRetry={() => nav.popToTop()}
        />
      </View>
    );
  }

  const categoryMeta = getCategoryMeta(category);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      let effectiveOptIn = pushOptIn;
      if (pushOptIn) {
        try {
          const { status } = await Notifications.requestPermissionsAsync();
          effectiveOptIn = status === 'granted';
        } catch {
          effectiveOptIn = false;
        }
      }
      await saveLostReport({ category, description, location, pushOptIn: effectiveOptIn });
      nav.navigate('Success');
    } catch {
      setError(t('loser.confirm.saveError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.root}>
      <ScreenHeader
        title={t('loser.flow.title')}
        onBack={() => nav.goBack()}
        accentColor={colors.loserPrimary}
        rightAction={<ProgressDots total={4} current={4} activeColor={colors.loserPrimary} />}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.heading}>
          <Text style={styles.title}>{t('loser.confirm.title')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={[typography.label, styles.sectionLabel]}>{t('loser.confirm.categorySection')}</Text>
          <View style={styles.categoryRow}>
            <View style={[styles.glyphBox, { backgroundColor: categoryMeta.tint }]}>
              <CategoryIcon id={category} color={colors.textPrimary} size={36} />
            </View>
            <View style={styles.categoryText}>
              <Text style={[typography.h3, styles.categoryName]}>{t(categoryMeta.labelKey)}</Text>
              {description && description.trim().length > 0 && (
                <Text style={[typography.body, styles.description]} numberOfLines={3}>
                  {description}
                </Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.rule} />

        <View style={styles.section}>
          <Text style={[typography.label, styles.sectionLabel]}>{t('loser.confirm.locationSection')}</Text>
          <LocationPreview value={location} />
        </View>

        <View style={styles.rule} />

        <View style={styles.section}>
          <Text style={[typography.label, styles.sectionLabel]}>{t('loser.confirm.notifySection')}</Text>
          <View style={styles.notifyRow}>
            <View style={styles.notifyText}>
              <Text style={typography.bodyBold}>{t('loser.confirm.pushLabel')}</Text>
              <Text style={[typography.caption, styles.notifyHint]}>{t('loser.confirm.pushHint')}</Text>
            </View>
            <PushToggle value={pushOptIn} onChange={setPushOptIn} />
          </View>
        </View>

        {error && (
          <Text style={[typography.caption, styles.errorText]}>{error}</Text>
        )}
      </ScrollView>

      <View style={styles.cta}>
        <Button
          label={t('loser.confirm.cta')}
          color={colors.loserPrimary}
          loading={submitting}
          onPress={handleSubmit}
        />
      </View>
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
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  title: {
    fontFamily: fontFamily.display,
    fontSize: 38,
    lineHeight: 40,
    letterSpacing: -1.8,
    color: colors.textPrimary,
  },
  section: { paddingVertical: spacing.md, gap: spacing.sm },
  sectionLabel: { color: colors.textSecondary, letterSpacing: 2.4 },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  glyphBox: {
    width: 72,
    height: 72,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: { flex: 1, gap: 2 },
  categoryName: { color: colors.textPrimary },
  description: { color: colors.textSecondary },
  rule: { height: 1.5, backgroundColor: colors.border },
  notifyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  notifyText: { flex: 1, gap: 2 },
  notifyHint: { color: colors.textSecondary },
  toggle: {
    width: 60,
    height: 32,
    borderWidth: 1.5,
    borderColor: colors.loserPrimary,
    padding: 2,
    justifyContent: 'center',
  },
  thumb: {
    width: 24,
    height: 24,
  },
  errorText: { color: colors.error, paddingTop: spacing.sm },
  cta: {
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1.5,
    borderTopColor: colors.border,
  },
});
