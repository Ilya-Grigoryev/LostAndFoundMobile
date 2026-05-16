import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenHeader } from '../../components/ui';
import { GeoBar, GeoCircle, GeoDotRow } from '../../components/ui/Geo';
import { useLocalization } from '../../contexts/LocalizationContext';
import { LoserStackParamList } from '../../navigation/types';
import { colors, fontFamily, spacing, typography } from '../../theme';
import { StringKey } from '../../constants/strings';

type Nav = NativeStackNavigationProp<LoserStackParamList, 'LocationMode'>;

interface BlockProps {
  index: '01' | '02';
  titleKey: StringKey;
  hintKey: StringKey;
  bg: string;
  geo: React.ReactNode;
  onPress: () => void;
}

function ModeBlock({ index, titleKey, hintKey, bg, geo, onPress }: BlockProps) {
  const { t } = useLocalization();
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 40, bounciness: 0 }).start();

  return (
    <Animated.View style={[styles.blockWrap, { transform: [{ scale }] }]}>
      <Pressable
        style={[styles.block, { backgroundColor: bg }]}
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        accessibilityRole="button"
        accessibilityLabel={t(titleKey)}
      >
        <View style={styles.geoAccent}>{geo}</View>

        <View style={styles.blockContent}>
          <Text style={styles.index}>{index}</Text>
          <Text style={[typography.h2, styles.blockHeading]}>{t(titleKey)}</Text>
          <Text style={[typography.caption, styles.hint]}>{t(hintKey)}</Text>
        </View>

        <View style={styles.arrowBox}>
          <Text style={styles.arrowText}>→</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function LocationModeScreen() {
  const nav = useNavigation<Nav>();
  const { t } = useLocalization();

  return (
    <View style={styles.root}>
      <ScreenHeader
        title=" "
        onBack={() => nav.goBack()}
        accentColor={colors.loserPrimary}
      />

      <View style={styles.heading}>
        <Text style={[typography.label, styles.eyebrow]}>02 — {t('loser.mode.title').toUpperCase()}</Text>
        <Text style={styles.title}>{t('loser.mode.title')}</Text>
        <Text style={[typography.body, styles.subtitle]}>{t('loser.mode.subtitle')}</Text>
      </View>

      <View style={styles.blocks}>
        <ModeBlock
          index="01"
          titleKey="loser.mode.map.title"
          hintKey="loser.mode.map.hint"
          bg={colors.loserLight}
          geo={
            <View style={styles.mapGeo}>
              <GeoCircle size={64} color={colors.loserPrimary} />
              <GeoDotRow colors={[colors.accent, colors.accent, colors.accent, colors.accent]} size={6} gap={8} />
            </View>
          }
          onPress={() => nav.navigate('LocationMap')}
        />

        <View style={styles.divider} />

        <ModeBlock
          index="02"
          titleKey="loser.mode.address.title"
          hintKey="loser.mode.address.hint"
          bg={colors.sageSoft}
          geo={
            <View style={styles.addressGeo}>
              <GeoBar width={80} height={8} color={colors.accent} />
              <GeoBar width={56} height={8} color={colors.accent} />
              <GeoBar width={40} height={8} color={colors.accent} />
            </View>
          }
          onPress={() => nav.navigate('LocationAddress')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  heading: {
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.xs,
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
  blocks: { flex: 1 },
  blockWrap: { flex: 1 },
  block: {
    flex: 1,
    padding: spacing.screenMargin,
    overflow: 'hidden',
  },
  geoAccent: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
  },
  mapGeo: { alignItems: 'flex-end', gap: spacing.sm },
  addressGeo: { alignItems: 'flex-end', gap: spacing.xs },
  blockContent: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.xs,
  },
  index: {
    fontFamily: fontFamily.display,
    fontSize: 64,
    lineHeight: 64,
    letterSpacing: -3,
    color: colors.textPrimary,
    opacity: 0.85,
  },
  blockHeading: {
    marginBottom: spacing.xs,
  },
  hint: {
    color: colors.textPrimary,
    opacity: 0.72,
  },
  arrowBox: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    width: 44,
    height: 44,
    borderWidth: 1.5,
    borderColor: colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontFamily: fontFamily.body,
    fontSize: 20,
    color: colors.textPrimary,
  },
  divider: {
    height: 1.5,
    backgroundColor: colors.border,
  },
});
