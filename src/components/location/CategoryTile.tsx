import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { CategoryId } from '../../types/loser';
import CategoryIcon from './CategoryIcon';
import { colors, spacing, typography } from '../../theme';

interface CategoryTileProps {
  id: CategoryId;
  label: string;
  tint: string;
  selected: boolean;
  fullWidth?: boolean;
  onPress: () => void;
}

export default function CategoryTile({ id, label, tint, selected, fullWidth, onPress }: CategoryTileProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 60, bounciness: 2 }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 60, bounciness: 2 }).start();

  const bg = selected ? colors.loserPrimary : tint;
  const fg = selected ? colors.textOnLoser : colors.textPrimary;
  const iconColor = selected ? colors.textOnLoser : colors.textPrimary;

  return (
    <Animated.View style={[styles.wrap, fullWidth && styles.full, { transform: [{ scale }] }]}>
      <Pressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ selected }}
        style={[styles.tile, { backgroundColor: bg }]}
      >
        <View style={styles.iconSlot}>
          <CategoryIcon id={id} color={iconColor} size={fullWidth ? 36 : 44} />
        </View>
        <Text style={[styles.label, { color: fg }]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const TILE_HEIGHT = 130;

const styles = StyleSheet.create({
  wrap: { width: '48.5%' },
  full: { width: '100%' },
  tile: {
    height: TILE_HEIGHT,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  iconSlot: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  label: {
    ...typography.button,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
});
