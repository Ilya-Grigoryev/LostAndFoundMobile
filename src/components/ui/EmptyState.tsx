import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme';

interface EmptyStateProps {
  message?: string;
  hint?: string;
  color?: string;
}

function SearchIcon({ color }: { color: string }) {
  return (
    <View style={iconStyles.wrap}>
      <View style={[iconStyles.circle, { borderColor: color }]} />
      <View style={[iconStyles.handle, { backgroundColor: color }]} />
    </View>
  );
}

const iconStyles = StyleSheet.create({
  wrap: { width: 52, height: 52 },
  circle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2.5,
  },
  handle: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 2.5,
    height: 18,
    borderRadius: 2,
    transform: [{ rotate: '-45deg' }],
  },
});

export default function EmptyState({
  message = 'Nichts gefunden.',
  hint,
  color = colors.border,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <SearchIcon color={color} />
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
  message: { ...typography.h3, color: colors.textPrimary, textAlign: 'center' },
  hint: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
});
