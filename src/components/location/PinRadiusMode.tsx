import Slider from '@react-native-community/slider';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import MapView, { Circle, MapPressEvent, Marker, MarkerDragStartEndEvent, PROVIDER_GOOGLE } from 'react-native-maps';
import { LatLng } from '../../types/loser';
import { colors, fontFamily, spacing, typography } from '../../theme';
import { useLocalization } from '../../contexts/LocalizationContext';

const VIENNA_CENTER: LatLng = { latitude: 48.2082, longitude: 16.3738 };
const MIN_RADIUS = 50;
const MAX_RADIUS = 500;
const RADIUS_STEP = 50;

interface PinRadiusModeProps {
  initial?: { coords: LatLng; radius: number };
  onChange: (coords: LatLng, radius: number) => void;
}

function PulsingPin() {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1.8] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0] });

  return (
    <View style={pinStyles.wrap}>
      <Animated.View
        style={[pinStyles.ring, { opacity: ringOpacity, transform: [{ scale: ringScale }] }]}
      />
      <View style={pinStyles.halo} />
      <View style={pinStyles.dot} />
    </View>
  );
}

export default function PinRadiusMode({ initial, onChange }: PinRadiusModeProps) {
  const { t } = useLocalization();
  const [coords, setCoords] = useState<LatLng>(initial?.coords ?? VIENNA_CENTER);
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
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onPress={handleMapPress}
      >
        <Marker
          coordinate={coords}
          draggable
          onDragEnd={handleDragEnd}
          anchor={{ x: 0.5, y: 0.5 }}
          tracksViewChanges
        >
          <PulsingPin />
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

const pinStyles = StyleSheet.create({
  wrap: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.loserPrimary,
  },
  halo: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.loserPrimary,
    opacity: 0.22,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.loserPrimary,
    borderWidth: 3,
    borderColor: colors.surface,
  },
});
