import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Button, ScreenHeader } from '../../components/ui';
import { TextInput } from '../../components/ui';
import SubTabSwitcher, { SubTabOption } from '../../components/location/SubTabSwitcher';
import { useFinderReport } from '../../contexts/FinderReportContext';
import { useLocalization } from '../../contexts/LocalizationContext';
import { searchAddresses } from '../../constants/viennaBezirke';
import { FinderStackParamList } from '../../navigation/types';
import { colors, fontFamily, spacing, typography } from '../../theme';
import { FinderLocation } from '../../types/finder';

type Nav = NativeStackNavigationProp<FinderStackParamList, 'Location'>;
type TabValue = 'map' | 'address';

const VIENNA_CENTER: FinderLocation = { latitude: 48.2082, longitude: 16.3738 };

const TAB_OPTIONS: readonly [SubTabOption<TabValue>, SubTabOption<TabValue>] = [
  { value: 'map', label: '' },
  { value: 'address', label: '' },
];

export default function FinderLocationScreen() {
  const nav = useNavigation<Nav>();
  const { t } = useLocalization();
  const { location: savedLocation, setLocation } = useFinderReport();

  const [tab, setTab] = useState<TabValue>('map');
  const [pinCoords, setPinCoords] = useState<FinderLocation | null>(savedLocation ?? null);
  const [addressQuery, setAddressQuery] = useState('');
  const [pickedAddress, setPickedAddress] = useState<string | null>(null);
  const [addressCoords, setAddressCoords] = useState<FinderLocation | null>(savedLocation ?? null);

  const tabOptions: readonly [SubTabOption<TabValue>, SubTabOption<TabValue>] = [
    { value: 'map', label: t('finder.location.tabMap') },
    { value: 'address', label: t('finder.location.tabAddress') },
  ];

  const suggestions = React.useMemo(() => {
    if (!addressQuery || addressQuery.trim().length < 2 || pickedAddress) return [];
    return searchAddresses(addressQuery, 5);
  }, [addressQuery, pickedAddress]);

  const handleConfirm = useCallback(() => {
    const loc = tab === 'map' ? pinCoords : addressCoords;
    if (!loc) return;
    setLocation(loc);
    nav.goBack();
  }, [tab, pinCoords, addressCoords, setLocation, nav]);

  const canConfirm = tab === 'map' ? !!pinCoords : !!addressCoords;

  return (
    <View style={styles.root}>
      <ScreenHeader
        title={t('finder.location.title')}
        onBack={() => nav.goBack()}
        accentColor={colors.finderPrimary}
      />

      <View style={styles.tabWrap}>
        <SubTabSwitcher
          options={tabOptions}
          value={tab}
          onChange={setTab}
          accentColor={colors.finderPrimary}
        />
      </View>

      {tab === 'map' ? (
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={StyleSheet.absoluteFill}
            initialRegion={{
              latitude: savedLocation?.latitude ?? VIENNA_CENTER.latitude,
              longitude: savedLocation?.longitude ?? VIENNA_CENTER.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
            onPress={e => setPinCoords(e.nativeEvent.coordinate)}
          >
            {pinCoords && (
              <Marker
                coordinate={pinCoords}
                anchor={{ x: 0.5, y: 1 }}
                tracksViewChanges={false}
              />
            )}
          </MapView>

          {!pinCoords && (
            <View pointerEvents="none" style={styles.mapHintWrap}>
              <View style={styles.mapHint}>
                <Text style={[typography.label, styles.mapHintText]}>
                  {t('finder.location.pinHint')}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.mapCta}>
            <Button
              label={t('finder.location.cta')}
              color={colors.finderPrimary}
              disabled={!canConfirm}
              onPress={handleConfirm}
            />
          </View>
        </View>
      ) : (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.addressScroll}
          showsVerticalScrollIndicator={false}
        >
          <TextInput
            placeholder={t('finder.location.addressPlaceholder')}
            value={addressQuery}
            onChangeText={text => {
              setAddressQuery(text);
              if (pickedAddress && text !== pickedAddress) {
                setPickedAddress(null);
                setAddressCoords(null);
              }
            }}
            autoCorrect={false}
            accentColor={colors.finderPrimary}
          />

          {!pickedAddress && addressQuery.trim().length >= 2 && (
            <View style={styles.suggestions}>
              {suggestions.length === 0 ? (
                <Text style={[typography.caption, styles.noResults]}>
                  {t('finder.location.noResults')}
                </Text>
              ) : (
                suggestions.map(s => (
                  <Pressable
                    key={`${s.bezirk.number}-${s.street}`}
                    onPress={() => {
                      const full = `${s.street}, ${s.bezirk.number.toString().padStart(2, '0')}. Bezirk`;
                      setAddressQuery(full);
                      setPickedAddress(full);
                      setAddressCoords({ latitude: s.bezirk.lat, longitude: s.bezirk.lng });
                    }}
                    style={({ pressed }) => [styles.suggRow, pressed && styles.suggRowPressed]}
                    accessibilityRole="button"
                  >
                    <View style={styles.suggBadge}>
                      <Text style={styles.suggBadgeText}>
                        {s.bezirk.number.toString().padStart(2, '0')}
                      </Text>
                    </View>
                    <View style={styles.suggText}>
                      <Text style={[typography.bodyBold, { color: colors.textPrimary }]}>
                        {s.street}
                      </Text>
                      <Text style={[typography.caption, { color: colors.textSecondary }]}>
                        {s.bezirk.name}
                      </Text>
                    </View>
                  </Pressable>
                ))
              )}
            </View>
          )}

          {pickedAddress && (
            <View style={styles.addressCta}>
              <Button
                label={t('finder.location.cta')}
                color={colors.finderPrimary}
                onPress={handleConfirm}
              />
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  tabWrap: { paddingHorizontal: spacing.screenMargin, paddingVertical: spacing.sm },
  mapContainer: { flex: 1, position: 'relative' },
  mapHintWrap: {
    position: 'absolute',
    top: spacing.md,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  mapHint: {
    backgroundColor: 'rgba(20,19,15,0.72)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  mapHintText: { color: colors.surface, letterSpacing: 1.6 },
  mapCta: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.screenMargin,
    right: spacing.screenMargin,
  },
  addressScroll: {
    padding: spacing.screenMargin,
    gap: spacing.sm,
    paddingBottom: spacing.xl,
  },
  suggestions: { gap: spacing.xs, marginTop: spacing.sm },
  noResults: { color: colors.textSecondary, paddingVertical: spacing.md },
  suggRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  suggRowPressed: { backgroundColor: colors.finderLight },
  suggBadge: {
    width: 36, height: 36,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: colors.finderPrimary,
  },
  suggBadgeText: {
    fontFamily: fontFamily.display,
    fontSize: 16, lineHeight: 16,
    color: colors.finderPrimary,
  },
  suggText: { flex: 1, gap: 2 },
  addressCta: { marginTop: spacing.md },
});
