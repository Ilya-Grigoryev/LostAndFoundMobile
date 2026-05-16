import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PinRadiusMode from '../../components/location/PinRadiusMode';
import RouteMode from '../../components/location/RouteMode';
import SubTabSwitcher, { SubTabOption } from '../../components/location/SubTabSwitcher';
import { Button, ProgressDots, ScreenHeader } from '../../components/ui';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useLoserReport } from '../../contexts/LoserReportContext';
import { LoserStackParamList } from '../../navigation/types';
import { LatLng } from '../../types/loser';
import { colors, spacing } from '../../theme';

type Nav = NativeStackNavigationProp<LoserStackParamList, 'LocationMap'>;
type MapTab = 'pin' | 'route';

export default function LocationMapScreen() {
  const nav = useNavigation<Nav>();
  const { t } = useLocalization();
  const { setLocation } = useLoserReport();

  const [tab, setTab] = useState<MapTab>('pin');
  const [pinCoords, setPinCoords] = useState<LatLng | null>(null);
  const [pinRadius, setPinRadius] = useState<number>(200);
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);

  const onPinChange = useCallback((coords: LatLng, radius: number) => {
    setPinCoords(coords);
    setPinRadius(radius);
  }, []);

  const onRouteChange = useCallback((coords: LatLng[]) => {
    setRouteCoords(coords);
  }, []);

  const options: readonly [SubTabOption<MapTab>, SubTabOption<MapTab>] = [
    { value: 'pin', label: t('loser.tab.pin') },
    { value: 'route', label: t('loser.tab.route') },
  ];

  const canContinue = tab === 'pin' ? pinCoords !== null : routeCoords.length >= 2;

  const handleContinue = () => {
    if (tab === 'pin' && pinCoords) {
      setLocation({ kind: 'pin', coords: pinCoords, radius: pinRadius });
    } else if (tab === 'route' && routeCoords.length >= 2) {
      setLocation({ kind: 'route', coords: routeCoords });
    }
    nav.navigate('Confirm');
  };

  return (
    <View style={styles.root}>
      <ScreenHeader
        title={t('loser.flow.title')}
        onBack={() => nav.goBack()}
        accentColor={colors.loserPrimary}
        rightAction={<ProgressDots total={4} current={3} activeColor={colors.loserPrimary} />}
      />

      <View style={styles.tabsWrap}>
        <SubTabSwitcher options={options} value={tab} onChange={setTab} />
      </View>

      <View style={styles.modeArea}>
        {tab === 'pin' ? (
          <PinRadiusMode
            initial={pinCoords ? { coords: pinCoords, radius: pinRadius } : undefined}
            onChange={onPinChange}
          />
        ) : (
          <RouteMode initial={routeCoords} onChange={onRouteChange} />
        )}
      </View>

      <View style={styles.cta}>
        <Button
          label={tab === 'pin' ? t('loser.pin.cta') : t('loser.route.cta')}
          color={colors.loserPrimary}
          disabled={!canContinue}
          onPress={handleContinue}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  tabsWrap: { paddingHorizontal: spacing.screenMargin, paddingVertical: spacing.sm },
  modeArea: { flex: 1 },
  cta: {
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
});
