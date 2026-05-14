import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme';

type Shape = 'circle' | 'square';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  color?: string;
  shape?: Shape;
}

export default function Chip({
  label,
  selected = false,
  onPress,
  color = colors.loserPrimary,
  shape = 'circle',
}: ChipProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.94, useNativeDriver: true, speed: 80 }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 80 }).start();

  const shapeStyle = shape === 'circle' ? styles.shapeCircle : styles.shapeSquare;
  const onAccent =
    color === colors.finderPrimary ? colors.textOnFinder : colors.textOnPrimary;
  const labelColor = selected ? onAccent : colors.textPrimary;
  const shapeColor = selected ? labelColor : color;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        style={[
          styles.chip,
          selected
            ? { backgroundColor: color, borderColor: color }
            : { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ selected }}
      >
        <View style={[shapeStyle, { backgroundColor: shapeColor }]} />
        <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 36,
    paddingHorizontal: spacing.md,
    borderRadius: radii.none,
    borderWidth: 1.5,
  },
  shapeCircle: { width: 10, height: 10, borderRadius: 5 },
  shapeSquare: { width: 10, height: 10 },
  label: { ...typography.button, fontSize: 13 },
});
