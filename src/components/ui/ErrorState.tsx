import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme';
import Button from './Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = 'Etwas ist schiefgelaufen.',
  onRetry,
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <View style={styles.exclamationBar} />
        <View style={styles.exclamationDot} />
      </View>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Button
          label="Erneut versuchen"
          onPress={onRetry}
          variant="secondary"
          color={colors.error}
          fullWidth={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.lg,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  exclamationBar: {
    width: 2,
    height: 20,
    backgroundColor: colors.error,
    borderRadius: radii.sm,
  },
  exclamationDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.error,
  },
  message: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
});
