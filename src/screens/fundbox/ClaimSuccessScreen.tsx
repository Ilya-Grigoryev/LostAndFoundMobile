import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SuccessReturnButton } from '../../components/ui';
import { GeoBar, GeoCircle, GeoSquare } from '../../components/ui/Geo';
import { useLocalization } from '../../contexts/LocalizationContext';
import { FundboxStackParamList } from '../../navigation/types';
import { colors, fontFamily, spacing, typography } from '../../theme';

type Nav = NativeStackNavigationProp<FundboxStackParamList, 'ClaimSuccess'>;

const AUTO_RETURN_MS = 2800;

export default function ClaimSuccessScreen() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { t } = useLocalization();
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

    const timer = setTimeout(() => {
      nav.getParent()?.goBack();
    }, AUTO_RETURN_MS);
    return () => clearTimeout(timer);
  }, [circleScale, heroOpacity, ctaOpacity, nav]);

  const goHome = () => nav.getParent()?.goBack();

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: Math.max(spacing.md, insets.bottom) }]}>
      <Animated.View
        style={[styles.bigCircle, { transform: [{ scale: circleScale }] }]}
        pointerEvents="none"
      >
        <GeoCircle size={520} color={colors.sage} />
      </Animated.View>

      <View style={styles.topAccent} pointerEvents="none">
        <GeoSquare size={36} color={colors.loserPrimary} />
      </View>
      <View style={styles.bottomAccent} pointerEvents="none">
        <GeoBar width={100} height={6} color={colors.accent} />
      </View>

      <Animated.View style={[styles.heroBlock, { opacity: heroOpacity }]}>
        <Text style={[typography.label, styles.eyebrow]}>{t('fundbox.claim.successEyebrow')}</Text>
        <Text style={styles.hero}>{t('fundbox.claim.successHero')}</Text>
        <Text style={[typography.body, styles.hint]}>{t('fundbox.claim.successHint')}</Text>
      </Animated.View>

      <SuccessReturnButton
        label={t('fundbox.claim.successHome')}
        color={colors.loserPrimary}
        onPress={goHome}
        opacity={ctaOpacity}
      />
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
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topAccent: {
    position: 'absolute',
    top: '12%',
    right: '10%',
  },
  bottomAccent: {
    position: 'absolute',
    bottom: '14%',
    left: '12%',
  },
  heroBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  eyebrow: {
    color: colors.surface,
    letterSpacing: 3.6,
  },
  hero: {
    fontFamily: fontFamily.display,
    fontSize: 46,
    lineHeight: 46,
    letterSpacing: -2,
    textAlign: 'center',
    color: colors.surface,
  },
  hint: {
    color: colors.surface,
    textAlign: 'center',
    opacity: 0.86,
  },
});
