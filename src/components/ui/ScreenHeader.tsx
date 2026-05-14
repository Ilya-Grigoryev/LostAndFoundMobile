import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  accentColor?: string;
}

export default function ScreenHeader({
  title,
  onBack,
  rightAction,
  accentColor,
}: ScreenHeaderProps) {
  const chevronColor = accentColor ?? colors.loserPrimary;

  return (
    <View style={styles.header}>
      <View style={styles.side}>
        {onBack && (
          <Pressable
            onPress={onBack}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.5 }]}
            accessibilityRole="button"
            accessibilityLabel="Zurück"
            hitSlop={12}
          >
            <View style={styles.chevronWrap}>
              <View style={[styles.chevronLine, styles.chevronTop, { backgroundColor: chevronColor }]} />
              <View style={[styles.chevronLine, styles.chevronBottom, { backgroundColor: chevronColor }]} />
            </View>
          </Pressable>
        )}
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <View style={[styles.side, styles.sideRight]}>{rightAction ?? null}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenMargin,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  side: { width: 44, alignItems: 'flex-start', justifyContent: 'center' },
  sideRight: { alignItems: 'flex-end' },
  title: {
    flex: 1,
    textAlign: 'center',
    ...typography.label,
    fontSize: 12,
    letterSpacing: 2,
    color: colors.textPrimary,
  },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  chevronWrap: { width: 10, height: 16, position: 'relative' },
  chevronLine: {
    position: 'absolute',
    width: 9,
    height: 1.5,
    borderRadius: 1,
    left: 0,
  },
  chevronTop: { top: 5, transform: [{ rotate: '-45deg' }, { translateX: 2 }] },
  chevronBottom: { bottom: 5, transform: [{ rotate: '45deg' }, { translateX: 2 }] },
});
