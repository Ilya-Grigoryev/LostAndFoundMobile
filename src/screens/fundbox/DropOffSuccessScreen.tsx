import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GeoBar, GeoCircle, GeoSquare } from '../../components/ui/Geo';
import { useLocalization } from '../../contexts/LocalizationContext';
import { getFundboxById } from '../../services/fundboxService';
import { FundboxStackParamList, MainStackParamList } from '../../navigation/types';
import { colors, fontFamily, spacing, typography } from '../../theme';

type Nav = NativeStackNavigationProp<FundboxStackParamList, 'DropOffSuccess'>;
type SuccessRouteProp = RouteProp<FundboxStackParamList, 'DropOffSuccess'>;

export default function DropOffSuccessScreen() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { t } = useLocalization();
  const { params } = useRoute<SuccessRouteProp>();
  const fundbox = getFundboxById(params.fundboxId);
  const depositId = params.depositId;

  const circleScale = useRef(new Animated.Value(0.4)).current;
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const ctaOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(circleScale, {
        toValue: 1,
        duration: 480,
        easing: Easing.out(Easing.back(1.4)),
        useNativeDriver: true,
      }),
      Animated.timing(heroOpacity, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }),
      Animated.timing(ctaOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [circleScale, heroOpacity, ctaOpacity]);

  const goHome = () =>
    nav.getParent<NativeStackNavigationProp<MainStackParamList>>()?.navigate('Home');

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: Math.max(spacing.md, insets.bottom) }]}>
      <Animated.View
        style={[styles.bigCircle, { transform: [{ scale: circleScale }] }]}
        pointerEvents="none"
      >
        <GeoCircle size={520} color={colors.finderPrimary} />
      </Animated.View>

      <View style={styles.topAccent} pointerEvents="none">
        <GeoSquare size={36} color={colors.accent} />
      </View>
      <View style={styles.bottomAccent} pointerEvents="none">
        <GeoBar width={100} height={6} color={colors.accent} />
      </View>

      <Animated.View style={[styles.heroBlock, { opacity: heroOpacity }]}>
        <Text style={[typography.label, styles.eyebrow]}>{t('fundbox.success.eyebrow')}</Text>
        <Text style={styles.hero}>{t('fundbox.success.hero')}</Text>
        <Text style={[typography.body, styles.hint]}>{t('fundbox.success.hint')}</Text>
        {fundbox && (
          <Text style={[typography.caption, styles.meta]} numberOfLines={1}>
            {fundbox.name}
          </Text>
        )}

        <Text style={[typography.label, styles.codeLabel]}>
          {t('fundbox.success.depositLabel')}
        </Text>
        <Text style={styles.codeText}>{depositId}</Text>

        <Text style={[typography.caption, styles.codeHint]}>
          {t('fundbox.success.depositHint')}
        </Text>
      </Animated.View>

      <Animated.View style={[styles.ctaWrap, { opacity: ctaOpacity }]}>
        <Button
          label={t('fundbox.success.home')}
          variant="secondary"
          color={colors.finderPrimary}
          onPress={goHome}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: 'hidden',
    paddingHorizontal: spacing.screenMargin,
  },
  bigCircle: {
    position: 'absolute',
    top: '20%',
    left: '-30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topAccent: { position: 'absolute', top: '12%', right: '10%' },
  bottomAccent: { position: 'absolute', bottom: '14%', left: '12%' },
  heroBlock: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.sm,
  },
  eyebrow: { color: colors.accent, letterSpacing: 3.6 },
  hero: {
    fontFamily: fontFamily.display,
    fontSize: 56,
    lineHeight: 58,
    letterSpacing: -2.5,
    textAlign: 'left',
    color: colors.accent,
  },
  hint: {
    color: colors.accent,
    opacity: 0.86,
    paddingRight: spacing.xl,
  },
  meta: { color: colors.accent, opacity: 0.7, marginTop: spacing.sm },
  codeLabel: { color: colors.accent, opacity: 0.7, letterSpacing: 2.4, marginTop: spacing.lg },
  codeText: {
    fontFamily: fontFamily.display,
    fontSize: 48,
    lineHeight: 52,
    letterSpacing: 1,
    color: colors.accent,
  },
  ctaWrap: {
    gap: spacing.sm,
  },
  codeHint: {
    color: colors.accent,
    opacity: 0.7,
    paddingRight: spacing.xl,
  },
});
