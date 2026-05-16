import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { CategoryId } from '../../types/loser';
import { GeoBar, GeoCircle, GeoDotRow, GeoSemicircle, GeoSquare } from '../ui/Geo';
import { colors, spacing, typography } from '../../theme';

interface CategoryTileProps {
  id: CategoryId;
  label: string;
  tint: string;
  selected: boolean;
  fullWidth?: boolean;
  onPress: () => void;
}

// Each category gets a unique Geo composition — never an emoji, never an icon font.
// The set is the visual vocabulary that ties the screen to the Bauhaus palette.
function GeoForCategory({ id, color }: { id: CategoryId; color: string }) {
  switch (id) {
    case 'backpack':
      return (
        <View style={styles.geoStack}>
          <GeoSemicircle size={28} color={color} side="top" />
          <GeoSquare size={44} color={color} />
        </View>
      );
    case 'keys':
      return (
        <View style={styles.geoRow}>
          <GeoCircle size={28} color={color} />
          <GeoBar width={36} height={8} color={color} />
        </View>
      );
    case 'wallet':
      return (
        <View style={styles.geoStackTight}>
          <GeoBar width={56} height={10} color={color} />
          <GeoBar width={56} height={10} color={color} />
        </View>
      );
    case 'phone':
      return <View style={[styles.phoneFrame, { borderColor: color }]}><GeoCircle size={6} color={color} /></View>;
    case 'documents':
      return (
        <View style={styles.geoStackTight}>
          <GeoBar width={56} height={6} color={color} />
          <GeoBar width={56} height={6} color={color} />
          <GeoBar width={56} height={6} color={color} />
        </View>
      );
    case 'bicycle':
      return (
        <View style={styles.geoRow}>
          <GeoCircle size={24} color={color} />
          <GeoBar width={20} height={6} color={color} />
          <GeoCircle size={24} color={color} />
        </View>
      );
    case 'other':
      return <GeoDotRow colors={[color, color, color]} size={12} gap={10} />;
  }
}

export default function CategoryTile({ id, label, tint, selected, fullWidth, onPress }: CategoryTileProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 60, bounciness: 2 }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 60, bounciness: 2 }).start();

  const bg = selected ? colors.loserPrimary : tint;
  const fg = selected ? colors.textOnLoser : colors.textPrimary;
  const geoColor = selected ? colors.textOnLoser : colors.textPrimary;

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
        <View style={styles.geoSlot}>
          <GeoForCategory id={id} color={geoColor} />
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
  geoSlot: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  geoStack: { gap: 2, alignItems: 'flex-start' },
  geoStackTight: { gap: 4, alignItems: 'flex-start' },
  geoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  phoneFrame: {
    width: 30,
    height: 56,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
  label: {
    ...typography.button,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
});
