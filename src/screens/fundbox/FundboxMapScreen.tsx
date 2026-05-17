import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Button, ScreenHeader } from '../../components/ui';
import { GeoSemicircle } from '../../components/ui/Geo';
import FundboxMarkerView from '../../components/fundbox/FundboxMarkerView';
import ProgressDots from '../../components/ui/ProgressDots';
import UserPositionMarker from '../../components/fundbox/UserPositionMarker';
import { Fundbox, fundboxes, mockUserPosition } from '../../constants/fundboxes';
import { useLocalization } from '../../contexts/LocalizationContext';
import { distanceMeters, findNearest } from '../../services/fundboxService';
import { FundboxStackParamList } from '../../navigation/types';
import { colors, fontFamily, spacing, typography } from '../../theme';

type Nav = NativeStackNavigationProp<FundboxStackParamList, 'Map'>;

export default function FundboxMapScreen() {
  const nav = useNavigation<Nav>();
  const { t } = useLocalization();

  const nearest = useMemo(() => findNearest(mockUserPosition), []);
  const [selectedId, setSelectedId] = useState<string>(nearest.id);

  const sortedBoxes = useMemo(() => {
    return [...fundboxes].sort((a, b) => {
      if (a.id === nearest.id) return -1;
      if (b.id === nearest.id) return 1;
      return distanceMeters(mockUserPosition, a) - distanceMeters(mockUserPosition, b);
    });
  }, [nearest.id]);

  const selected = fundboxes.find(f => f.id === selectedId) ?? nearest;

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
            tracksViewChanges
          >
            <UserPositionMarker />
          </Marker>
          {fundboxes.map(f => (
            <Marker
              key={f.id}
              coordinate={{ latitude: f.latitude, longitude: f.longitude }}
              onPress={() => setSelectedId(f.id)}
              anchor={{ x: 0.5, y: 0.5 }}
              tracksViewChanges
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
        <Text style={[typography.label, styles.listLabel]}>{t('fundbox.map.allBoxes')}</Text>
        <ScrollView
          style={styles.list}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {sortedBoxes.map(f => (
            <FundboxRow
              key={f.id}
              fundbox={f}
              selected={f.id === selectedId}
              recommended={f.id === nearest.id}
              distance={distanceMeters(mockUserPosition, f)}
              onPress={() => setSelectedId(f.id)}
              recommendedLabel={t('fundbox.map.recommended')}
            />
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

interface FundboxRowProps {
  fundbox: Fundbox;
  selected: boolean;
  recommended: boolean;
  distance: number;
  recommendedLabel: string;
  onPress: () => void;
}

function FundboxRow({
  fundbox,
  selected,
  recommended,
  distance,
  recommendedLabel,
  onPress,
}: FundboxRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        selected && styles.rowSelected,
        pressed && !selected && { backgroundColor: colors.background },
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={fundbox.name}
    >
      <View style={[styles.rowIndicator, selected && styles.rowIndicatorSelected]} />
      <View style={styles.rowInfo}>
        <Text style={[styles.rowName, selected && styles.rowNameSelected]} numberOfLines={1}>
          {fundbox.name}
        </Text>
        <Text style={[typography.caption, styles.rowMeta]} numberOfLines={1}>
          {fundbox.district} · {formatDistance(distance)}
          {recommended ? ` · ${recommendedLabel}` : ''}
        </Text>
      </View>
      {selected && <Text style={styles.rowCheck}>✓</Text>}
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
  cornerAccent: {
    position: 'absolute',
    top: 0,
    right: 0,
    opacity: 0.55,
  },
  sheet: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: 1.5,
    borderTopColor: colors.border,
    gap: spacing.sm,
    maxHeight: '52%',
  },
  listLabel: {
    color: colors.textSecondary,
  },
  list: {
    maxHeight: 240,
  },
  listContent: {
    gap: spacing.xs,
    paddingBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.borderSubtle,
  },
  rowSelected: {
    backgroundColor: colors.finderLight,
    borderColor: colors.accent,
  },
  rowIndicator: {
    width: 6,
    height: 32,
    backgroundColor: colors.borderSubtle,
  },
  rowIndicatorSelected: {
    backgroundColor: colors.finderPrimary,
  },
  rowInfo: {
    flex: 1,
    gap: 2,
  },
  rowName: {
    fontFamily: fontFamily.bodyBold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  rowNameSelected: {
    color: colors.textPrimary,
  },
  rowMeta: {
    color: colors.textSecondary,
  },
  rowCheck: {
    fontFamily: fontFamily.bodyBlack,
    fontSize: 18,
    color: colors.accent,
    paddingHorizontal: spacing.xs,
  },
});
