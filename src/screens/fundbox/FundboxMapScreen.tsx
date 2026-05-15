import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Button, ScreenHeader } from '../../components/ui';
import { GeoSemicircle } from '../../components/ui/Geo';
import FundboxMarkerView from '../../components/fundbox/FundboxMarkerView';
import ProgressDots from '../../components/fundbox/ProgressDots';
import { Fundbox, fundboxes, mockUserPosition } from '../../constants/fundboxes';
import { useLocalization } from '../../contexts/LocalizationContext';
import { distanceMeters, findNearest, walkingMinutes } from '../../services/fundboxService';
import { FundboxStackParamList } from '../../navigation/types';
import { colors, fontFamily, spacing, typography } from '../../theme';

type Nav = NativeStackNavigationProp<FundboxStackParamList, 'Map'>;

export default function FundboxMapScreen() {
  const nav = useNavigation<Nav>();
  const { t } = useLocalization();

  const nearest = useMemo(() => findNearest(mockUserPosition), []);
  const [selectedId, setSelectedId] = useState<string>(nearest.id);

  const selected = fundboxes.find(f => f.id === selectedId) ?? nearest;
  const selectedDistance = distanceMeters(mockUserPosition, selected);
  const isRecommended = selected.id === nearest.id;

  return (
    <View style={styles.root}>
      <ScreenHeader
        title={t('fundbox.map.title')}
        onBack={() => nav.goBack()}
        accentColor={colors.finderPrimary}
        rightAction={<ProgressDots total={4} current={1} />}
      />

      <View style={styles.mapWrap}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFill}
          initialRegion={{
            latitude: mockUserPosition.latitude,
            longitude: mockUserPosition.longitude,
            latitudeDelta: 0.04,
            longitudeDelta: 0.04,
          }}
        >
          <Marker
            coordinate={mockUserPosition}
            anchor={{ x: 0.5, y: 0.5 }}
            tracksViewChanges={false}
          >
            <View style={styles.userPos} />
          </Marker>
          {fundboxes.map(f => (
            <Marker
              key={f.id}
              coordinate={{ latitude: f.latitude, longitude: f.longitude }}
              onPress={() => setSelectedId(f.id)}
              anchor={{ x: 0.5, y: 0.5 }}
              tracksViewChanges={f.id === nearest.id}
            >
              <FundboxMarkerView active={f.id === selectedId} />
            </Marker>
          ))}
        </MapView>

        <View pointerEvents="none" style={styles.cornerAccent}>
          <GeoSemicircle size={120} color={colors.sageSoft} side="left" />
        </View>
      </View>

      <View style={styles.sheet}>
        <View style={styles.sheetHeader}>
          {isRecommended ? (
            <Text style={[typography.label, styles.eyebrowRecommended]}>
              {t('fundbox.map.recommended')} · {formatDistance(selectedDistance)}
            </Text>
          ) : (
            <Text style={[typography.label, styles.eyebrow]}>
              {formatDistance(selectedDistance)} · {walkingMinutes(selectedDistance)} {t('fundbox.route.timeUnit')}
            </Text>
          )}
          <Text style={[typography.h3, styles.name]} numberOfLines={1}>
            {selected.name}
          </Text>
          <Text style={[typography.caption, styles.meta]}>
            {selected.address} · {selected.hours}
          </Text>
        </View>

        <Text style={[typography.label, styles.othersLabel]}>{t('fundbox.map.otherOptions')}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {fundboxes
            .filter(f => f.id !== selectedId)
            .map(f => (
              <AltChip key={f.id} fundbox={f} onPress={() => setSelectedId(f.id)} />
            ))}
        </ScrollView>

        <Button
          label={t('fundbox.map.routeCta')}
          color={colors.finderPrimary}
          onPress={() => nav.navigate('Route', { fundboxId: selected.id })}
        />
      </View>
    </View>
  );
}

function AltChip({ fundbox, onPress }: { fundbox: Fundbox; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.altChip, pressed && { opacity: 0.6 }]}
    >
      <Text style={[typography.caption, styles.altChipDistrict]}>{fundbox.district}</Text>
      <Text style={[styles.altChipName]} numberOfLines={1}>
        {fundbox.name.split(' · ')[0]}
      </Text>
    </Pressable>
  );
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapWrap: {
    flex: 1,
    overflow: 'hidden',
  },
  userPos: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.accent,
    borderWidth: 2.5,
    borderColor: colors.surface,
  },
  cornerAccent: {
    position: 'absolute',
    top: 0,
    right: 0,
    opacity: 0.55,
  },
  sheet: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    borderTopWidth: 1.5,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  sheetHeader: {
    gap: spacing.xs,
  },
  eyebrow: {
    color: colors.textSecondary,
  },
  eyebrowRecommended: {
    color: colors.finderPressed,
  },
  name: {
    color: colors.textPrimary,
  },
  meta: {
    color: colors.textSecondary,
  },
  othersLabel: {
    color: colors.textSecondary,
  },
  chipRow: {
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  altChip: {
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minWidth: 140,
    gap: 2,
  },
  altChipDistrict: {
    color: colors.textSecondary,
  },
  altChipName: {
    fontFamily: fontFamily.bodyBold,
    fontSize: 14,
    color: colors.textPrimary,
  },
});
