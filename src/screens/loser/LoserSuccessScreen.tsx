import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/ui';
import { GeoBar, GeoCircle, GeoSemicircle } from '../../components/ui/Geo';
import { useLocalization } from '../../contexts/LocalizationContext';
import { LoserStackParamList } from '../../navigation/types';
import { colors, fontFamily, spacing, typography } from '../../theme';

type Nav = NativeStackNavigationProp<LoserStackParamList, 'Success'>;

export default function LoserSuccessScreen() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { t } = useLocalization();

  const circleScale = useRef(new Animated.Value(0.5)).current;
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const ctaOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(circleScale, {
        toValue: 1,
        duration: 520,
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

  const goHome = () => nav.getParent()?.goBack();

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: Math.max(spacing.md, insets.bottom) }]}>
      <Animated.View
        pointerEvents="none"
        style={[styles.bigCircle, { transform: [{ scale: circleScale }] }]}
      >
        <GeoCircle size={520} color={colors.loserPressed} />
      </Animated.View>

      <View pointerEvents="none" style={styles.topAccent}>
        <GeoSemicircle size={120} color={colors.loserLight} side="left" />
      </View>
      <View pointerEvents="none" style={styles.bottomAccent}>
        <GeoBar width={120} height={6} color={colors.loserLight} />
      </View>

      <Animated.View style={[styles.heroBlock, { opacity: heroOpacity }]}>
        <Text style={[typography.label, styles.eyebrow]}>{t('loser.success.eyebrow')}</Text>
        <Text style={styles.hero}>{t('loser.success.hero')}</Text>
        <Text style={[typography.body, styles.hint]}>{t('loser.success.hint')}</Text>
      </Animated.View>

      <Animated.View style={[styles.ctaWrap, { opacity: ctaOpacity }]}>
        <Button
          label={t('loser.success.home')}
          variant="secondary"
          color={colors.loserPrimary}
          onPress={goHome}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.loserPrimary,
    paddingHorizontal: spacing.screenMargin,
    overflow: 'hidden',
  },
  bigCircle: {
    position: 'absolute',
    top: '20%',
    left: '-30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topAccent: { position: 'absolute', top: '10%', right: 0 },
  bottomAccent: { position: 'absolute', bottom: '14%', left: '12%' },
  heroBlock: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.sm,
  },
  eyebrow: { color: colors.textOnLoser, opacity: 0.85, letterSpacing: 3.2 },
  hero: {
    fontFamily: fontFamily.display,
    fontSize: 64,
    lineHeight: 64,
    letterSpacing: -3,
    color: colors.textOnLoser,
  },
  hint: {
    color: colors.textOnLoser,
    opacity: 0.86,
    paddingRight: spacing.xl,
  },
  ctaWrap: {},
});
