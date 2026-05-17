import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Button, ScreenHeader } from '../../components/ui';
import { GeoSquare } from '../../components/ui/Geo';
import RouteStat from '../../components/fundbox/RouteStat';
import UserPositionMarker from '../../components/fundbox/UserPositionMarker';
import { mockUserPosition } from '../../constants/fundboxes';
import { useLocalization } from '../../contexts/LocalizationContext';
import { FundboxStackParamList } from '../../navigation/types';
import { distanceMeters, walkingMinutes } from '../../services/fundboxService';
import { colors, spacing } from '../../theme';

type Nav = NativeStackNavigationProp<FundboxStackParamList, 'MatchLocation'>;
type MatchLocationRoute = RouteProp<FundboxStackParamList, 'MatchLocation'>;

const schwedenplatzDemoLatitude = 48.21155;
const schwedenplatzDemoLongitude = 16.37815;

export default function MatchLocationScreen() {
  const nav = useNavigation<Nav>();
  const { params } = useRoute<MatchLocationRoute>();
  const { t } = useLocalization();

  const categoryLabel = params?.categoryLabel ?? t('matching.itemFallback');
  const placeLabel = params?.placeLabel ?? t('matching.cityFallbackPlace');
  const foundPlaceForMap = {
    latitude: params?.latitude ?? schwedenplatzDemoLatitude,
    longitude: params?.longitude ?? schwedenplatzDemoLongitude,
  };

  const metersToFoundPlace = distanceMeters(mockUserPosition, {
    ...foundPlaceForMap,
    id: '',
    name: '',
    district: '',
    address: '',
    hours: '',
  });
  const minutesToFoundPlace = walkingMinutes(metersToFoundPlace);

  const lineCoordsForRoute = useMemo(
    () => [mockUserPosition, foundPlaceForMap],
    [foundPlaceForMap.latitude, foundPlaceForMap.longitude],
  );

  const mapRegionForFoundPlace = useMemo(() => {
    const middleLatitude = (mockUserPosition.latitude + foundPlaceForMap.latitude) / 2;
    const middleLongitude = (mockUserPosition.longitude + foundPlaceForMap.longitude) / 2;
    const latitudeZoom = Math.abs(mockUserPosition.latitude - foundPlaceForMap.latitude) * 2.2 + 0.01;
    const longitudeZoom = Math.abs(mockUserPosition.longitude - foundPlaceForMap.longitude) * 2.2 + 0.01;
    return {
      latitude: middleLatitude,
      longitude: middleLongitude,
      latitudeDelta: latitudeZoom,
      longitudeDelta: longitudeZoom,
    };
  }, [foundPlaceForMap.latitude, foundPlaceForMap.longitude]);

  return (
    <View style={styles.root}>
      <ScreenHeader
        title={categoryLabel}
        onBack={() => nav.goBack()}
        accentColor={colors.loserPrimary}
      />

      <View style={styles.mapWrap}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFill}
          initialRegion={mapRegionForFoundPlace}
        >
          <Polyline
            coordinates={lineCoordsForRoute}
            strokeColor={colors.loserPrimary}
            strokeWidth={4}
            lineDashPattern={[6, 4]}
          />
          <Marker coordinate={mockUserPosition} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges>
            <UserPositionMarker />
          </Marker>
          <Marker coordinate={foundPlaceForMap} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
            <View style={styles.foundMarker}>
              <GeoSquare size={22} color={colors.loserPrimary} />
            </View>
          </Marker>
        </MapView>

        <View pointerEvents="none" style={styles.statBar}>
          <RouteStat distanceMeters={metersToFoundPlace} minutes={minutesToFoundPlace} destination={placeLabel} />
        </View>
      </View>

      <View style={styles.bottom}>
        <Button
          label={t('matching.backCta')}
          color={colors.loserPrimary}
          onPress={() => nav.goBack()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapWrap: {
    flex: 1,
  },
  statBar: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.screenMargin,
    right: spacing.screenMargin,
  },
  foundMarker: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.loserLight,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  bottom: {
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1.5,
    borderTopColor: colors.border,
  },
});
