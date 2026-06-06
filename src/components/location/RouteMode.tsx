import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { MapPressEvent, Marker, Polyline } from 'react-native-maps';
import UserPositionMarker from '../fundbox/UserPositionMarker';
import { mockUserPosition } from '../../constants/fundboxes';
import { LatLng } from '../../types/loser';
import { colors, fontFamily, spacing, typography } from '../../theme';
import { useLocalization } from '../../contexts/LocalizationContext';

interface RouteModeProps {
  initial?: LatLng[];
  onChange: (coords: LatLng[]) => void;
}

export default function RouteMode({ initial, onChange }: RouteModeProps) {
  const { t } = useLocalization();
  const [coords, setCoords] = useState<LatLng[]>(initial ?? []);

  useEffect(() => {
    onChange(coords);
  }, [coords, onChange]);

  const handleMapPress = (e: MapPressEvent) => {
    setCoords(prev => [...prev, e.nativeEvent.coordinate]);
  };

  const undo = () => setCoords(prev => prev.slice(0, -1));

  return (
    <View style={styles.root}>
      <MapView

        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: mockUserPosition.latitude,
          longitude: mockUserPosition.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onPress={handleMapPress}
      >
        <Marker
          coordinate={mockUserPosition}
          anchor={{ x: 0.5, y: 0.5 }}
          tracksViewChanges
        >
          <UserPositionMarker />
        </Marker>

        {coords.map((c, i) => (
          <Marker
            key={`${c.latitude}-${c.longitude}-${i}`}
            coordinate={c}
            anchor={{ x: 0.5, y: 0.5 }}
            tracksViewChanges={false}
          >
            <View style={styles.pointDot} />
          </Marker>
        ))}
        {coords.length >= 2 && (
          <Polyline
            coordinates={coords}
            strokeColor={colors.loserPrimary}
            strokeWidth={4}
          />
        )}
      </MapView>

      <View style={styles.panel}>
        <View style={styles.counterBlock}>
          <Text style={styles.bigNumber}>{coords.length}</Text>
          <Text style={[typography.label, styles.counterLabel]}>{t('loser.route.pointCount')}</Text>
        </View>

        <Pressable
          onPress={undo}
          disabled={coords.length === 0}
          style={[styles.actionBtn, coords.length === 0 && styles.disabled]}
        >
          <Text style={styles.actionLabel}>{t('loser.route.undo')}</Text>
        </Pressable>

        <Text style={[typography.caption, styles.hint]}>{t('loser.route.hint')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  pointDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.loserPrimary,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  panel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1.5,
    borderTopColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  counterBlock: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
  },
  bigNumber: {
    fontFamily: fontFamily.display,
    fontSize: 48,
    lineHeight: 48,
    letterSpacing: -2,
    color: colors.textPrimary,
  },
  counterLabel: { color: colors.textSecondary, letterSpacing: 2.4 },
  actionBtn: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  actionLabel: {
    ...typography.button,
    fontSize: 13,
    color: colors.textPrimary,
  },
  disabled: { opacity: 0.4 },
  hint: { color: colors.textSecondary },
});
