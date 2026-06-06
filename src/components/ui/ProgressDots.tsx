import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '../../theme';

interface ProgressDotsProps {
  total: number;
  current: number;
  activeColor?: string;
}

export default function ProgressDots({ total, current, activeColor = colors.finderPrimary }: ProgressDotsProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => {
        const step = i + 1;
        const isCurrent = step === current;
        const isPast = step < current;
        const bg = isCurrent ? activeColor : isPast ? colors.accent : 'transparent';
        const border = isCurrent || isPast ? bg : colors.borderSubtle;
        const size = isCurrent ? 12 : 8;
        return (
          <View
            key={i}
            style={[
              styles.dot,
              {
                width: size,
                height: size,
                backgroundColor: bg,
                borderColor: border,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dot: {
    borderWidth: 1.5,
  },
});
