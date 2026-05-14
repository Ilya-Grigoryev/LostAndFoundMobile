/**
 * Geometric primitives — the visual vocabulary of Bauhaus Wien.
 * Use these to compose distinctive interface elements (decorative accents
 * inside cards, dividers, category indicators, etc.). They are not generic
 * "icons" — they are structural design language.
 */

import React from 'react';
import { View } from 'react-native';
import { colors } from '../../theme';

interface GeoProps {
  size?: number;
  color?: string;
}

export function GeoCircle({ size = 24, color = colors.loserPrimary }: GeoProps) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }} />
  );
}

export function GeoSquare({ size = 24, color = colors.finderPrimary }: GeoProps) {
  return <View style={{ width: size, height: size, backgroundColor: color }} />;
}

interface SemicircleProps extends GeoProps {
  side?: 'left' | 'right' | 'top' | 'bottom';
}

export function GeoSemicircle({
  size = 80,
  color = colors.loserPrimary,
  side = 'right',
}: SemicircleProps) {
  const radius = size;
  const styleBySide = {
    right: {
      width: size / 2,
      height: size,
      borderTopRightRadius: radius,
      borderBottomRightRadius: radius,
    },
    left: {
      width: size / 2,
      height: size,
      borderTopLeftRadius: radius,
      borderBottomLeftRadius: radius,
    },
    top: {
      width: size,
      height: size / 2,
      borderTopLeftRadius: radius,
      borderTopRightRadius: radius,
    },
    bottom: {
      width: size,
      height: size / 2,
      borderBottomLeftRadius: radius,
      borderBottomRightRadius: radius,
    },
  }[side];

  return <View style={{ ...styleBySide, backgroundColor: color }} />;
}

interface BarProps {
  width?: number;
  height?: number;
  color?: string;
}

export function GeoBar({ width = 40, height = 4, color = colors.accent }: BarProps) {
  return <View style={{ width, height, backgroundColor: color }} />;
}

interface DotRowProps {
  colors?: string[];
  size?: number;
  gap?: number;
}

export function GeoDotRow({
  colors: dotColors = [colors.loserPrimary, colors.finderPrimary, colors.accent],
  size = 10,
  gap = 6,
}: DotRowProps) {
  return (
    <View style={{ flexDirection: 'row', gap }}>
      {dotColors.map((c, i) => (
        <View key={i} style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: c }} />
      ))}
    </View>
  );
}
