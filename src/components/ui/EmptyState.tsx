import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme';

interface EmptyStateProps {
  message?: string;
  hint?: string;
  color?: string;
}

export default function EmptyState({
  message = 'Nichts gefunden.',
  hint,
  color = colors.border,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {/* Bauhaus empty mark: outlined square with a circle inside (empty container) */}
      <View style={styles.iconWrap}>
        <View style={[styles.box, { borderColor: color }]} />
        <View style={[styles.dot, { backgroundColor: color }]} />
      </View>
      <Text style={styles.message}>{message}</Text>
      {hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  iconWrap: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 56,
    height: 56,
    borderWidth: 2,
    position: 'absolute',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  message: { ...typography.h3, color: colors.textPrimary, textAlign: 'center' },
  hint: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
});
