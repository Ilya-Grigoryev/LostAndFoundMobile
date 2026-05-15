import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, ScreenHeader } from '../../components/ui';
import { GeoBar, GeoCircle } from '../../components/ui/Geo';
import CodeBoxes from '../../components/fundbox/CodeBoxes';
import ProgressDots from '../../components/fundbox/ProgressDots';
import { useLocalization } from '../../contexts/LocalizationContext';
import { getFundboxById } from '../../services/fundboxService';
import { FundboxStackParamList } from '../../navigation/types';
import { colors, fontFamily, spacing, typography } from '../../theme';

type Nav = NativeStackNavigationProp<FundboxStackParamList, 'Code'>;
type CodeRouteProp = RouteProp<FundboxStackParamList, 'Code'>;

export default function VerificationCodeScreen() {
  const nav = useNavigation<Nav>();
  const { params } = useRoute<CodeRouteProp>();
  const { t } = useLocalization();

  const fundbox = getFundboxById(params.fundboxId);
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    // expo-clipboard isn't installed yet (out of scope for Phase 7).
    // We still toggle the visual confirmation so the interaction feels alive.
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  // Pop the entire Fundbox stack — returns to Home in MainNavigator.
  const goHome = () => {
    nav.getParent()?.goBack();
  };

  return (
    <View style={styles.root}>
      <ScreenHeader
        title={t('fundbox.code.title')}
        accentColor={colors.finderPrimary}
        rightAction={<ProgressDots total={4} current={4} />}
      />

      <View style={styles.body}>
        <View style={styles.heroWrap}>
          <View style={styles.heroDecor} pointerEvents="none">
            <GeoCircle size={180} color={colors.sageSoft} />
          </View>
          <View style={styles.heroBar} pointerEvents="none">
            <GeoBar width={120} height={6} color={colors.accent} />
          </View>
          <Text style={[typography.hero, styles.hero]}>{t('fundbox.code.hero')}</Text>
        </View>

        <View style={styles.codeBlock}>
          <Text style={[typography.label, styles.eyebrow]}>{t('fundbox.code.eyebrow')}</Text>
          <CodeBoxes mode="display" code={params.code} />
          <Text style={[typography.caption, styles.hint]}>{t('fundbox.code.hint')}</Text>
        </View>

        {fundbox && (
          <Text style={[typography.caption, styles.meta]} numberOfLines={1}>
            {fundbox.name} · {fundbox.address}
          </Text>
        )}
      </View>

      <View style={styles.bottom}>
        <Pressable
          onPress={copyCode}
          style={({ pressed }) => [styles.copyRow, pressed && { opacity: 0.5 }]}
          accessibilityRole="button"
          accessibilityLabel={t('fundbox.code.copyCta')}
        >
          <Text style={styles.copyText}>
            {copied ? `✓ ${t('fundbox.code.copied')}` : t('fundbox.code.copyCta')}
          </Text>
        </Pressable>
        <Button
          label={t('fundbox.code.homeCta')}
          color={colors.finderPrimary}
          onPress={goHome}
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
    flex: 1,
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.lg,
    gap: spacing.xl,
  },
  heroWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  heroDecor: {
    position: 'absolute',
    left: '14%',
    top: 0,
  },
  heroBar: {
    position: 'absolute',
    right: '8%',
    bottom: 10,
  },
  hero: {
    color: colors.textPrimary,
    fontSize: 56,
    lineHeight: 58,
    letterSpacing: -2.5,
    fontFamily: fontFamily.display,
    textAlign: 'center',
  },
  codeBlock: {
    alignItems: 'center',
    gap: spacing.md,
  },
  eyebrow: {
    color: colors.textSecondary,
  },
  hint: {
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  meta: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  bottom: {
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1.5,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  copyRow: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  copyText: {
    ...typography.button,
    color: colors.accent,
  },
});
