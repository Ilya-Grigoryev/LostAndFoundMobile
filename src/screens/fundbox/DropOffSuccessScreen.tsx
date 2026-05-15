import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GeoBar, GeoCircle, GeoSquare } from '../../components/ui/Geo';
import { useLocalization } from '../../contexts/LocalizationContext';
import { getFundboxById } from '../../services/fundboxService';
import { FundboxStackParamList } from '../../navigation/types';
import { colors, fontFamily, spacing, typography } from '../../theme';

type Nav = NativeStackNavigationProp<FundboxStackParamList, 'DropOffSuccess'>;
type SuccessRouteProp = RouteProp<FundboxStackParamList, 'DropOffSuccess'>;

const AUTO_RETURN_MS = 2800;

export default function DropOffSuccessScreen() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { t } = useLocalization();
  const { params } = useRoute<SuccessRouteProp>();
  const fundbox = getFundboxById(params.fundboxId);

  const circleScale = useRef(new Animated.Value(0.4)).current;
  const heroOpacity = useRef(new Animated.Value(0)).current;

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
    ]).start();

    const timer = setTimeout(() => {
      nav.getParent()?.goBack();
    }, AUTO_RETURN_MS);
    return () => clearTimeout(timer);
  }, [circleScale, heroOpacity, nav]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
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
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  bigCircle: {
    position: 'absolute',
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
    alignItems: 'center',
    paddingHorizontal: spacing.screenMargin,
    gap: spacing.sm,
  },
  eyebrow: {
    color: colors.accent,
    letterSpacing: 3.6,
  },
  hero: {
    fontFamily: fontFamily.display,
    fontSize: 56,
    lineHeight: 58,
    letterSpacing: -2.5,
    textAlign: 'center',
    color: colors.accent,
  },
  hint: {
    color: colors.accent,
    textAlign: 'center',
    opacity: 0.86,
    paddingHorizontal: spacing.md,
  },
  meta: {
    color: colors.accent,
    opacity: 0.7,
    marginTop: spacing.sm,
  },
});
