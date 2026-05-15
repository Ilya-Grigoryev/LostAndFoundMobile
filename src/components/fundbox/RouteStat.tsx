import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, typography } from '../../theme';

interface RouteStatProps {
  distanceMeters: number;
  minutes: number;
  destination: string;
}

// Three-block Bauhaus stat bar: distance / time / name.
// Big poster-style numerals (Archivo Black) — readable at a glance.
export default function RouteStat({ distanceMeters, minutes, destination }: RouteStatProps) {
  const distance =
    distanceMeters < 1000
      ? `${Math.round(distanceMeters)}`
      : `${(distanceMeters / 1000).toFixed(1)}`;
  const distanceUnit = distanceMeters < 1000 ? 'm' : 'km';

  return (
    <View style={styles.row}>
      <Cell value={distance} unit={distanceUnit} />
      <View style={styles.divider} />
      <Cell value={`${minutes}`} unit="min" />
      <View style={styles.divider} />
      <Cell label={destination} />
    </View>
  );
}

function Cell({ value, unit, label }: { value?: string; unit?: string; label?: string }) {
  if (label) {
    return (
      <View style={[styles.cell, styles.cellLabelOnly]}>
        <Text style={[typography.label, styles.unit]}>Ziel</Text>
        <Text style={styles.destination} numberOfLines={2}>
          {label}
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.cell}>
      <Text style={styles.value}>{value}</Text>
      <Text style={[typography.label, styles.unit]}>{unit}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  cell: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'flex-start',
    gap: 2,
  },
  cellLabelOnly: {
    flex: 1.6,
  },
  divider: {
    width: 1.5,
    backgroundColor: colors.border,
  },
  value: {
    fontFamily: fontFamily.display,
    fontSize: 32,
    lineHeight: 34,
    letterSpacing: -1.5,
    color: colors.textPrimary,
  },
  unit: {
    color: colors.textSecondary,
  },
  destination: {
    fontFamily: fontFamily.bodyBold,
    fontSize: 14,
    color: colors.textPrimary,
  },
});
