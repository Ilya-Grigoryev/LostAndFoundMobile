import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, fontFamily, spacing, typography } from '../../theme';
import { GeoCircle, GeoDotRow, GeoSquare } from '../../components/ui/Geo';
import { useLocalization } from '../../contexts/LocalizationContext';
import { MainStackParamList } from '../../navigation/types';
import { runCityMatchingDemo } from '../../services/matchingService';

type HomeNavProp = NativeStackNavigationProp<MainStackParamList, 'Home'>;

interface BlockProps {
  symbol: string;
  heading: string;
  hint: string;
  bgColor: string;
  textColor: string;
  geoAccent: React.ReactNode;
  onPress: () => void;
}

function ActionBlock({ symbol, heading, hint, bgColor, textColor, geoAccent, onPress }: BlockProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 40, bounciness: 0 }).start();

  return (
    <Animated.View style={[styles.blockWrap, { transform: [{ scale }] }]}>
      <Pressable
        style={[styles.block, { backgroundColor: bgColor }]}
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
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

export default function HomeScreen() {
  const nav = useNavigation<HomeNavProp>();
  const insets = useSafeAreaInsets();
  const { language, setLanguage, t } = useLocalization();

  const switchHomeLanguage = () => {
    setLanguage(language === 'de' ? 'en' : 'de').catch(() => undefined);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={[styles.header, { paddingTop: insets.top + spacing.xs }]}>
        <GeoDotRow size={8} gap={5} />
        <Text style={[typography.label, styles.appName]}>Wien Fundus</Text>
        <Pressable
          onPress={switchHomeLanguage}
          style={({ pressed }) => [styles.langPill, pressed && styles.langPillPressed]}
          accessibilityRole="button"
          accessibilityLabel="Switch language"
        >
          <Text style={[typography.label, styles.langText]}>{language.toUpperCase()}</Text>
        </Pressable>
      </View>

      <View style={styles.blocks}>
        <ActionBlock
          symbol="?"
          heading={t('home.lost.heading')}
          hint={t('home.lost.hint')}
          bgColor={colors.loserPrimary}
          textColor={colors.textOnLoser}
          geoAccent={<GeoCircle size={60} color="rgba(255,255,255,0.16)" />}
          onPress={() => nav.navigate('Loser')}
        />

        <View style={styles.divider} />

        <ActionBlock
          symbol="!"
          heading={t('home.found.heading')}
          hint={t('home.found.hint')}
          bgColor={colors.finderPrimary}
          textColor={colors.textOnFinder}
          geoAccent={<GeoSquare size={48} color="rgba(20,19,15,0.10)" />}
          onPress={() => nav.navigate('Finder')}
        />
      </View>

      {__DEV__ && (
        <View style={[styles.devRow, { paddingBottom: insets.bottom + spacing.sm }]}>
          <Pressable
            onPress={() => nav.navigate('Fundbox')}
            style={({ pressed }) => [styles.devCell, pressed && { opacity: 0.5 }]}
            accessibilityRole="button"
            accessibilityLabel="Fundbox flow demo"
          >
            <Text style={[typography.label, styles.devEntryText]}>Dev · Fundbox</Text>
          </Pressable>
          <View style={styles.devDivider} />
          <Pressable
            onPress={() => nav.navigate('Fundbox', { screen: 'Claim' })}
            style={({ pressed }) => [styles.devCell, pressed && { opacity: 0.5 }]}
            accessibilityRole="button"
            accessibilityLabel="Claim flow demo"
          >
            <Text style={[typography.label, styles.devEntryText]}>Dev · Claim</Text>
          </Pressable>
          <View style={styles.devDivider} />
          <Pressable
            onPress={() => runCityMatchingDemo(language).catch(() => undefined)}
            style={({ pressed }) => [styles.devCell, pressed && { opacity: 0.5 }]}
            accessibilityRole="button"
            accessibilityLabel="City match demo"
          >
            <Text style={[typography.label, styles.devEntryText]}>Dev · City</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenMargin,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
    backgroundColor: colors.background,
  },
  appName: {
    flex: 1,
    color: colors.textPrimary,
    marginLeft: spacing.xs,
  },
  langPill: {
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  langText: {
    color: colors.textPrimary,
  },
  langPillPressed: {
    backgroundColor: colors.accentLight,
  },
  blocks: {
    flex: 1,
  },
  blockWrap: {
    flex: 1,
  },
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
  blockContent: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.sm,
  },
  symbol: {
    fontFamily: fontFamily.display,
    fontSize: 88,
    lineHeight: 88,
    letterSpacing: -4,
    marginBottom: spacing.xs,
  },
  heading: {
    marginBottom: spacing.xs,
  },
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
  arrowText: {
    fontFamily: fontFamily.body,
    fontSize: 20,
  },
  divider: {
    height: 1.5,
    backgroundColor: colors.border,
  },
  devRow: {
    flexDirection: 'row',
    paddingTop: spacing.sm,
    backgroundColor: colors.background,
    borderTopWidth: 1.5,
    borderTopColor: colors.border,
  },
  devCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  devDivider: {
    width: 1.5,
    backgroundColor: colors.border,
  },
  devEntryText: {
    color: colors.textSecondary,
  },
});
