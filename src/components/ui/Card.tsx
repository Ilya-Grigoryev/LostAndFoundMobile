import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { colors, radii, spacing } from '../../theme';

type Accent = 'loser' | 'finder' | 'none';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  accent?: Accent;
}

export default function Card({ children, style, accent = 'none', ...rest }: CardProps) {
  const accentColor =
    accent === 'loser' ? colors.loserPrimary : accent === 'finder' ? colors.finderPrimary : undefined;

  return (
    <View style={[styles.card, style]} {...rest}>
      {accentColor && <View style={[styles.accentBar, { backgroundColor: accentColor }]} />}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  accentBar: { width: 3 },
  content: { flex: 1, padding: spacing.md },
});
