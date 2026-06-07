import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import FundboxMarkerView from '../../components/fundbox/FundboxMarkerView';
import RouteStat from '../../components/fundbox/RouteStat';
import UserPositionMarker from '../../components/fundbox/UserPositionMarker';
import { Button, ScreenHeader } from '../../components/ui';
import { fundboxes, mockUserPosition } from '../../constants/fundboxes';
import { useLocalization } from '../../contexts/LocalizationContext';
import { FundboxStackParamList } from '../../navigation/types';
import {
  distanceMeters,
  generatePickupCode,
  getFundboxById,
  walkingMinutes,
} from '../../services/fundboxService';
import { colors, fontFamily, spacing, typography } from '../../theme';

type Nav = NativeStackNavigationProp<FundboxStackParamList, 'MatchFundboxRoute'>;
type MatchFundboxRoute = RouteProp<FundboxStackParamList, 'MatchFundboxRoute'>;

export default function MatchFundboxRouteScreen() {
  const nav = useNavigation<Nav>();
  const { params } = useRoute<MatchFundboxRoute>();
  const { t } = useLocalization();
  const insets = useSafeAreaInsets();

  const fundbox = params?.fundboxId ? getFundboxById(params.fundboxId) ?? fundboxes[0] : fundboxes[0];
  const meters = distanceMeters(mockUserPosition, fundbox);
  const minutes = walkingMinutes(meters);

  // Ownership was verified on the match screen, so the system releases the pickup code to the
  // owner here — the finder never sees it and the compartment stays hidden until entry (ISSUE-13).
  const pickupCode = useMemo(() => generatePickupCode(), []);
  const validUntil = useMemo(() => {
    const due = new Date();
    due.setDate(due.getDate() + 2);
    due.setHours(18, 0, 0, 0);
    const pad = (value: number) => String(value).padStart(2, '0');
    return `${pad(due.getDate())}.${pad(due.getMonth() + 1)}.${due.getFullYear()} ${pad(due.getHours())}:${pad(due.getMinutes())}`;
  }, []);

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
        title={params?.categoryLabel ?? t('fundbox.matchRoute.title')}
        onBack={() => nav.goBack()}
        accentColor={colors.loserPrimary}
      />

      <View style={styles.mapWrap}>
        <MapView
          style={StyleSheet.absoluteFill}
          initialRegion={region}
        >
          <Polyline
            coordinates={coords}
            strokeColor={colors.loserPrimary}
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

      <View style={[styles.bottom, { paddingBottom: Math.max(spacing.md, insets.bottom) }]}>
        <View style={styles.codePanel}>
          <Text style={[typography.label, styles.codeEyebrow]}>
            {t('fundbox.matchRoute.codeEyebrow')}
          </Text>
          <Text style={[typography.label, styles.codeLabel]}>
            {t('fundbox.matchRoute.codeLabel')}
          </Text>
          <Text style={styles.codeValue}>
            {pickupCode.slice(0, 3)} – {pickupCode.slice(3)}
          </Text>
          <Text style={[typography.caption, styles.codeMeta]}>
            {t('fundbox.matchRoute.codeValid')} {validUntil} · {fundbox.name.split(' · ')[0]}
          </Text>
          <Text style={[typography.caption, styles.codeNote]}>
            {t('fundbox.matchRoute.codeNote')}
          </Text>
        </View>

        <Button
          label={t('fundbox.matchRoute.pickedUpCta')}
          color={colors.loserPrimary}
          onPress={() => nav.replace('ClaimSuccess')}
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
    gap: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1.5,
    borderTopColor: colors.border,
  },
  codePanel: {
    backgroundColor: colors.loserLight,
    borderWidth: 1.5,
    borderColor: colors.loserPrimary,
    padding: spacing.md,
    gap: spacing.xs,
  },
  codeEyebrow: {
    color: colors.loserPressed,
    letterSpacing: 2.4,
  },
  codeLabel: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  codeValue: {
    fontFamily: fontFamily.display,
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: 1,
    color: colors.textPrimary,
  },
  codeMeta: {
    color: colors.textSecondary,
  },
  codeNote: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
