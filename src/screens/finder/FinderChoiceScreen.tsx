import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../components/ui';
import { GeoCircle, GeoSquare } from '../../components/ui/Geo';
import { useFinderReport } from '../../contexts/FinderReportContext';
import { useLocalization } from '../../contexts/LocalizationContext';
import { MainStackParamList, FinderStackParamList } from '../../navigation/types';
import { saveFinderReport } from '../../services/finderReportService';
import { colors, fontFamily, spacing, typography } from '../../theme';

type Nav = NativeStackNavigationProp<FinderStackParamList, 'Choice'>;
type ParentNav = NativeStackNavigationProp<MainStackParamList>;

interface ChoiceBlockProps {
  symbol: string;
  heading: string;
  hint: string;
  bgColor: string;
  textColor: string;
  geoAccent: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
}

function ChoiceBlock({ symbol, heading, hint, bgColor, textColor, geoAccent, onPress, disabled }: ChoiceBlockProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 40, bounciness: 0 }).start();

  return (
    <Animated.View style={[styles.blockWrap, { transform: [{ scale }] }]}>
      <Pressable
        style={[styles.block, { backgroundColor: bgColor }, disabled && styles.blockDisabled]}
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={heading}
      >
        <View style={styles.geoAccent}>{geoAccent}</View>
        <View style={styles.blockContent}>
          <Text style={[styles.symbol, { color: textColor }]}>{symbol}</Text>
          <Text style={[typography.h2, styles.heading, { color: textColor }]}>{heading}</Text>
          <Text style={[typography.caption, { color: textColor, opacity: 0.72 }]}>{hint}</Text>
        </View>
        <View style={[styles.arrowBox, { borderColor: textColor + '40' }]}>
          <Text style={[styles.arrowText, { color: textColor }]}>→</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function FinderChoiceScreen() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { t } = useLocalization();
  const { photoUri, location, reset } = useFinderReport();

  const [saving, setSaving] = useState(false);

  const handleLeave = async () => {
    if (!photoUri || !location || saving) return;
    setSaving(true);
    try {
      await saveFinderReport(photoUri, location);
    } catch {
      // silently continue — mock app, no error UI needed here
    } finally {
      setSaving(false);
    }
    reset();
    nav.navigate('Success');
  };

  const handleFundbox = () => {
    nav.getParent<NativeStackNavigationProp<MainStackParamList>>()?.navigate('Fundbox');
  };

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom }]}>
      <ScreenHeader
        title={t('finder.choice.title')}
        onBack={() => nav.goBack()}
        accentColor={colors.finderPrimary}
      />

      <View style={styles.blocks}>
        <ChoiceBlock
          symbol="✓"
          heading={t('finder.choice.leaveHeading')}
          hint={t('finder.choice.leaveHint')}
          bgColor={colors.finderLight}
          textColor={colors.textPrimary}
          geoAccent={<GeoCircle size={56} color="rgba(20,19,15,0.08)" />}
          onPress={handleLeave}
          disabled={saving}
        />

        <View style={styles.divider} />

        <ChoiceBlock
          symbol="□"
          heading={t('finder.choice.fundboxHeading')}
          hint={t('finder.choice.fundboxHint')}
          bgColor={colors.finderPrimary}
          textColor={colors.textOnFinder}
          geoAccent={<GeoSquare size={44} color="rgba(20,19,15,0.10)" />}
          onPress={handleFundbox}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  blocks: { flex: 1 },
  blockWrap: { flex: 1 },
  block: {
    flex: 1,
    padding: spacing.screenMargin,
    overflow: 'hidden',
  },
  blockDisabled: { opacity: 0.5 },
  geoAccent: { position: 'absolute', top: spacing.lg, right: spacing.lg },
  blockContent: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.sm,
  },
  symbol: {
    fontFamily: fontFamily.display,
    fontSize: 72,
    lineHeight: 72,
    letterSpacing: -3,
    marginBottom: spacing.xs,
  },
  heading: { marginBottom: spacing.xs },
  arrowBox: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    width: 44,
    height: 44,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: { fontFamily: fontFamily.body, fontSize: 20 },
  divider: { height: 1.5, backgroundColor: colors.border },
});
