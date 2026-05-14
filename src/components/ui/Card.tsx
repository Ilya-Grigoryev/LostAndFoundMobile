import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { colors, radii, spacing } from '../../theme';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  bordered?: boolean;
}

export default function Card({ children, bordered = false, style, ...rest }: CardProps) {
  return (
    <View style={[styles.card, bordered && styles.bordered, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.none,
    padding: spacing.md,
  },
  bordered: {
    borderWidth: 1.5,
    borderColor: colors.border,
  },
});
