import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Circle, Marker, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { LatLng, LocationValue } from '../../types/loser';
import { getBezirk } from '../../constants/viennaBezirke';
import { colors, fontFamily, spacing, typography } from '../../theme';

interface LocationPreviewProps {
  value: LocationValue;
}

function regionFor(coords: LatLng[], pad = 0.01): Region {
  const lats = coords.map(c => c.latitude);
  const lngs = coords.map(c => c.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max(pad, maxLat - minLat + pad),
    longitudeDelta: Math.max(pad, maxLng - minLng + pad),
  };
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

export default function LocationPreview({ value }: LocationPreviewProps) {
  if (value.kind === 'pin') {
    return (
      <View style={styles.mapWrap}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
          initialRegion={{
            latitude: value.coords.latitude,
            longitude: value.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={value.coords} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges>
            <View style={styles.pinDot} />
          </Marker>
          <Circle
            center={value.coords}
            radius={value.radius}
            strokeColor={colors.loserPrimary}
            strokeWidth={2}
            fillColor="rgba(200,101,75,0.18)"
          />
        </MapView>
      </View>
    );
  }

  if (value.kind === 'route') {
    return (
      <View style={styles.mapWrap}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
          initialRegion={regionFor(value.coords)}
        >
          {value.coords.map((c, i) => (
            <Marker
              key={`${c.latitude}-${c.longitude}-${i}`}
              coordinate={c}
              anchor={{ x: 0.5, y: 0.5 }}
              tracksViewChanges={false}
            >
              <View style={styles.pointDot} />
            </Marker>
          ))}
          <Polyline coordinates={value.coords} strokeColor={colors.loserPrimary} strokeWidth={4} />
        </MapView>
      </View>
    );
  }

  if (value.kind === 'steps') {
    const bezirk = getBezirk(value.bezirk);
    return (
      <View style={styles.textBlock}>
        <View style={styles.bezirkBadge}>
          <Text style={styles.bezirkNumber}>{pad(bezirk.number)}</Text>
        </View>
        <View style={styles.textCol}>
          <Text style={typography.bodyBold}>{bezirk.name}</Text>
          {value.street && <Text style={typography.body}>{value.street}</Text>}
          {value.landmark && (
            <Text style={[typography.caption, styles.landmark]}>{value.landmark}</Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.textBlock}>
      <View style={styles.addressBadge}>
        <Text style={styles.bezirkNumber}>@</Text>
      </View>
      <View style={styles.textCol}>
        <Text style={typography.bodyBold} numberOfLines={2}>
          {value.address}
        </Text>
      </View>
    </View>
  );
}

const MAP_HEIGHT = 160;

const styles = StyleSheet.create({
  mapWrap: {
    height: MAP_HEIGHT,
    borderWidth: 1.5,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.loserPrimary,
    borderWidth: 3,
    borderColor: colors.surface,
  },
  pointDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.loserPrimary,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  textBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  bezirkBadge: {
    width: 56,
    height: 56,
    borderWidth: 1.5,
    borderColor: colors.loserPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressBadge: {
    width: 56,
    height: 56,
    backgroundColor: colors.loserLight,
    borderWidth: 1.5,
    borderColor: colors.loserPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bezirkNumber: {
    fontFamily: fontFamily.display,
    fontSize: 22,
    lineHeight: 22,
    color: colors.loserPrimary,
  },
  textCol: { flex: 1, gap: 2 },
  landmark: { color: colors.textSecondary },
});
