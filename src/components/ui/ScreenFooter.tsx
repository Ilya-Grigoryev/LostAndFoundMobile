import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../../theme';
import Button from './Button';

interface ScreenFooterProps {
  label: string;
  onPress: () => void;
  color?: string;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  withArrow?: boolean;
}

export default function ScreenFooter({
  label,
  onPress,
  color,
  disabled,
  loading,
  variant,
  withArrow,
}: ScreenFooterProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingBottom: Math.max(spacing.md, insets.bottom) }]}>
      <Button
        label={label}
        onPress={onPress}
        color={color}
        disabled={disabled}
        loading={loading}
        variant={variant}
        withArrow={withArrow}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1.5,
    borderTopColor: colors.border,
  },
});
