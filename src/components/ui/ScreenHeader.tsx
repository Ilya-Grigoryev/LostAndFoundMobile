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
  const dotColor = accentColor ?? colors.loserPrimary;

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
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.titleWrap}>
        <View style={[styles.titleDot, { backgroundColor: dotColor }]} />
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>

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
    borderBottomWidth: 1.5,
    borderBottomColor: colors.border,
  },
  side: { width: 44, alignItems: 'flex-start', justifyContent: 'center' },
  sideRight: { alignItems: 'flex-end' },
  titleWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  titleDot: { width: 8, height: 8, borderRadius: 4 },
  title: {
    ...typography.h3,
    fontSize: 16,
    letterSpacing: -0.3,
    color: colors.textPrimary,
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontFamily: typography.button.fontFamily,
    fontSize: 22,
    color: colors.textPrimary,
  },
});
