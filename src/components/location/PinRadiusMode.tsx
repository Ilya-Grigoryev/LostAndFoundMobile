import Slider from '@react-native-community/slider';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Circle, MapPressEvent, Marker, MarkerDragStartEndEvent, PROVIDER_GOOGLE } from 'react-native-maps';
import UserPositionMarker from '../fundbox/UserPositionMarker';
import { mockUserPosition } from '../../constants/fundboxes';
import { LatLng } from '../../types/loser';
import { colors, fontFamily, spacing, typography } from '../../theme';
import { useLocalization } from '../../contexts/LocalizationContext';

const MIN_RADIUS = 50;
const MAX_RADIUS = 500;
const RADIUS_STEP = 50;

interface PinRadiusModeProps {
  initial?: { coords: LatLng; radius: number };
  onChange: (coords: LatLng, radius: number) => void;
}

export default function PinRadiusMode({ initial, onChange }: PinRadiusModeProps) {
  const { t } = useLocalization();
  const [coords, setCoords] = useState<LatLng>(initial?.coords ?? mockUserPosition);
  const [radius, setRadius] = useState<number>(initial?.radius ?? 200);

  useEffect(() => {
    onChange(coords, radius);
  }, [coords, radius, onChange]);

  const handleMapPress = (e: MapPressEvent) => setCoords(e.nativeEvent.coordinate);
  const handleDragEnd = (e: MarkerDragStartEndEvent) => setCoords(e.nativeEvent.coordinate);

  return (
    <View style={styles.root}>
      <MapView
        provider={PROVIDER_GOOGLE}
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

        <Marker
          coordinate={coords}
          draggable
          onDragEnd={handleDragEnd}
          anchor={{ x: 0.5, y: 0.5 }}
          tracksViewChanges={false}
        >
          <View style={styles.centerDot} />
        </Marker>

        <Circle
          center={coords}
          radius={radius}
          strokeColor={colors.loserPrimary}
          strokeWidth={2}
          fillColor="rgba(200,101,75,0.18)"
        />
      </MapView>

      <View style={styles.panel}>
        <Text style={[typography.label, styles.eyebrow]}>{t('loser.pin.radiusLabel')}</Text>
        <View style={styles.row}>
          <Text style={styles.bigNumber}>{radius}</Text>
          <Text style={styles.unit}>m</Text>
          <Slider
            style={styles.slider}
            minimumValue={MIN_RADIUS}
            maximumValue={MAX_RADIUS}
            step={RADIUS_STEP}
            value={radius}
            minimumTrackTintColor={colors.loserPrimary}
            maximumTrackTintColor={colors.borderSubtle}
            thumbTintColor={colors.loserPrimary}
            onValueChange={setRadius}
          />
        </View>
        <Text style={[typography.caption, styles.hint]}>{t('loser.pin.hint')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  centerDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.loserPrimary,
    borderWidth: 3,
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
  eyebrow: { color: colors.loserPrimary, letterSpacing: 2.4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  bigNumber: {
    fontFamily: fontFamily.display,
    fontSize: 48,
    lineHeight: 48,
    letterSpacing: -2,
    color: colors.textPrimary,
    minWidth: 80,
  },
  unit: {
    ...typography.bodyBold,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  slider: { flex: 1, height: 40 },
  hint: { color: colors.textSecondary },
});
