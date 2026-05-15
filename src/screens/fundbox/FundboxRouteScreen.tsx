import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Button, ScreenHeader } from '../../components/ui';
import FundboxMarkerView from '../../components/fundbox/FundboxMarkerView';
import ProgressDots from '../../components/fundbox/ProgressDots';
import RouteStat from '../../components/fundbox/RouteStat';
import UserPositionMarker from '../../components/fundbox/UserPositionMarker';
import { mockUserPosition } from '../../constants/fundboxes';
import { useLocalization } from '../../contexts/LocalizationContext';
import {
  distanceMeters,
  getFundboxById,
  walkingMinutes,
} from '../../services/fundboxService';
import { FundboxStackParamList } from '../../navigation/types';
import { colors, spacing } from '../../theme';

type Nav = NativeStackNavigationProp<FundboxStackParamList, 'Route'>;
type RouteRouteProp = RouteProp<FundboxStackParamList, 'Route'>;

export default function FundboxRouteScreen() {
  const nav = useNavigation<Nav>();
  const { params } = useRoute<RouteRouteProp>();
  const { t } = useLocalization();

  const fundbox = getFundboxById(params.fundboxId);
  if (!fundbox) {
    nav.goBack();
    return null;
  }

  const meters = distanceMeters(mockUserPosition, fundbox);
  const minutes = walkingMinutes(meters);

  const coords = useMemo(
    () => [
      mockUserPosition,
      { latitude: fundbox.latitude, longitude: fundbox.longitude },
    ],
    [fundbox.latitude, fundbox.longitude],
  );

  const region = useMemo(() => {
    const midLat = (mockUserPosition.latitude + fundbox.latitude) / 2;
    const midLng = (mockUserPosition.longitude + fundbox.longitude) / 2;
    const latDelta = Math.abs(mockUserPosition.latitude - fundbox.latitude) * 2.2 + 0.01;
    const lngDelta = Math.abs(mockUserPosition.longitude - fundbox.longitude) * 2.2 + 0.01;
    return {
      latitude: midLat,
      longitude: midLng,
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta,
    };
  }, [fundbox.latitude, fundbox.longitude]);

  return (
    <View style={styles.root}>
      <ScreenHeader
        title={t('fundbox.route.title')}
        onBack={() => nav.goBack()}
        accentColor={colors.finderPrimary}
        rightAction={<ProgressDots total={4} current={2} />}
      />

      <View style={styles.mapWrap}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFill}
          initialRegion={region}
        >
          <Polyline
            coordinates={coords}
            strokeColor={colors.accent}
            strokeWidth={4}
            lineDashPattern={[6, 4]}
          />
          <Marker coordinate={mockUserPosition} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges>
            <UserPositionMarker />
          </Marker>
          <Marker
            coordinate={{ latitude: fundbox.latitude, longitude: fundbox.longitude }}
            anchor={{ x: 0.5, y: 0.5 }}
            tracksViewChanges={false}
          >
            <FundboxMarkerView active />
          </Marker>
        </MapView>

        <View pointerEvents="none" style={styles.statBar}>
          <RouteStat distanceMeters={meters} minutes={minutes} destination={fundbox.district} />
        </View>
      </View>

      <View style={styles.bottom}>
        <Button
          label={t('fundbox.route.arrivedCta')}
          color={colors.finderPrimary}
          onPress={() => nav.navigate('DropOff', { fundboxId: fundbox.id })}
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
  bottom: {
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1.5,
    borderTopColor: colors.border,
  },
});
