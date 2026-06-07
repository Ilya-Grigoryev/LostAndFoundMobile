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

type HomeNavProp = NativeStackNavigationProp<MainStackParamList, 'Home'>;

interface BlockProps {
  symbol: string;
  heading: string;
  hint: string;
  bgColor: string;
  textColor: string;
  geoAccent: React.ReactNode;
  onPress: () => void;
  bottomInset?: number;
}

function ActionBlock({ symbol, heading, hint, bgColor, textColor, geoAccent, onPress, bottomInset = 0 }: BlockProps) {
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

        <View style={[styles.arrowBox, { borderColor: textColor + '40', bottom: spacing.md + bottomInset }]}>
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
          onPress={() => nav.navigate('ActivityHistory')}
          style={({ pressed }) => [styles.historyPill, pressed && styles.headerButtonPressed]}
          accessibilityRole="button"
          accessibilityLabel={t('activity.headerButtonLabel')}
        >
          <Text style={[typography.label, styles.historyText]}>
            {t('activity.headerButtonText')}
          </Text>
        </Pressable>
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
          bottomInset={insets.bottom}
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
  historyPill: {
    height: 28,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  historyText: {
    color: colors.textPrimary,
    fontSize: 10,
    letterSpacing: 1.4,
  },
  langPill: {
    width: 40,
    height: 28,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  langText: {
    color: colors.textPrimary,
  },
  headerButtonPressed: {
    opacity: 0.55,
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
});
