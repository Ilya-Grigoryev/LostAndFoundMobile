import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CategoryId } from '../../types/loser';
import { GeoBar, GeoCircle, GeoDotRow, GeoSemicircle, GeoSquare } from '../ui/Geo';
import { colors } from '../../theme';

interface CategoryGlyphProps {
  id: CategoryId;
  color?: string;
  scale?: number;
}

// Bauhaus glyph for a given category. Composed from Geo primitives.
// `scale` lets the same composition shrink for summaries / cards.
export default function CategoryGlyph({ id, color = colors.textPrimary, scale = 1 }: CategoryGlyphProps) {
  const s = (n: number) => Math.max(4, Math.round(n * scale));

  switch (id) {
    case 'backpack':
      return (
        <View style={styles.stack}>
          <GeoSemicircle size={s(28)} color={color} side="top" />
          <GeoSquare size={s(44)} color={color} />
        </View>
      );
    case 'keys':
      return (
        <View style={styles.row}>
          <GeoCircle size={s(28)} color={color} />
          <GeoBar width={s(36)} height={s(8)} color={color} />
        </View>
      );
    case 'wallet':
      return (
        <View style={styles.stackTight}>
          <GeoBar width={s(56)} height={s(10)} color={color} />
          <GeoBar width={s(56)} height={s(10)} color={color} />
        </View>
      );
    case 'phone':
      return (
        <View style={[styles.phoneFrame, { borderColor: color, width: s(30), height: s(56) }]}>
          <GeoCircle size={s(6)} color={color} />
        </View>
      );
    case 'documents':
      return (
        <View style={styles.stackTight}>
          <GeoBar width={s(56)} height={s(6)} color={color} />
          <GeoBar width={s(56)} height={s(6)} color={color} />
          <GeoBar width={s(56)} height={s(6)} color={color} />
        </View>
      );
    case 'bicycle':
      return (
        <View style={styles.row}>
          <GeoCircle size={s(24)} color={color} />
          <GeoBar width={s(20)} height={s(6)} color={color} />
          <GeoCircle size={s(24)} color={color} />
        </View>
      );
    case 'other':
      return <GeoDotRow colors={[color, color, color]} size={s(12)} gap={s(10)} />;
  }
}

const styles = StyleSheet.create({
  stack: { gap: 2, alignItems: 'flex-start' },
  stackTight: { gap: 4, alignItems: 'flex-start' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  phoneFrame: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
});
