import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme';
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
      <View style={styles.iconBox}>
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
          withArrow={false}
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
  iconBox: {
    width: 56,
    height: 56,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  exclamationBar: { width: 4, height: 22, backgroundColor: colors.surface },
  exclamationDot: { width: 4, height: 4, backgroundColor: colors.surface },
  message: { ...typography.bodyBold, color: colors.textPrimary, textAlign: 'center' },
});
