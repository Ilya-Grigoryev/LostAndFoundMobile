import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, ScreenHeader } from '../../components/ui';
import { useFinderReport } from '../../contexts/FinderReportContext';
import { useLocalization } from '../../contexts/LocalizationContext';
import { FinderStackParamList } from '../../navigation/types';
import { colors, fontFamily, spacing, typography } from '../../theme';
import { FinderLocation } from '../../types/finder';

type Nav = NativeStackNavigationProp<FinderStackParamList, 'CameraGps'>;

export default function FinderCameraGpsScreen() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { t } = useLocalization();
  const { photoUri, location, setPhoto, setLocation } = useFinderReport();

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [locationSource, setLocationSource] = useState<'auto' | 'manual' | null>(
    location ? 'manual' : null,
  );
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    (async () => {
      await requestCameraPermission();

      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      setLocationPermission(granted);
      if (granted && !location) {
        setGpsLoading(true);
        try {
          const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          const loc: FinderLocation = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };
          setLocation(loc);
          setLocationSource('auto');
        } catch {
        } finally {
          setGpsLoading(false);
        }
      }
    })();
  }, []);

  const takePicture = useCallback(async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
    if (photo?.uri) setPhoto(photo.uri);
  }, [setPhoto]);

  const retryPhoto = useCallback(() => setPhoto(''), [setPhoto]);
  const openSettings = useCallback(() => Linking.openSettings(), []);
  const goToLocation = useCallback(() => nav.navigate('Location'), [nav]);

  const retryScale = useRef(new Animated.Value(1)).current;
  const settingsScale = useRef(new Animated.Value(1)).current;

  const pressIn = (scale: Animated.Value) =>
    Animated.spring(scale, { toValue: 0.93, useNativeDriver: true, speed: 60, bounciness: 0 }).start();
  const pressOut = (scale: Animated.Value) =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 60, bounciness: 2 }).start();

  const canContinue = !!photoUri && !!location;

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom }]}>
      <ScreenHeader
        title={t('finder.camera.title')}
        onBack={() => nav.getParent()?.goBack()}
        accentColor={colors.finderPrimary}
      />

      <View style={styles.cameraBlock}>
        {!cameraPermission?.granted ? (
          <View style={styles.permissionBox}>
            <View style={styles.permissionIcon}>
              <View style={styles.permIconBar} />
              <View style={styles.permIconDot} />
            </View>
            <Text style={[typography.bodyBold, styles.permissionText]}>
              {t('finder.camera.noCameraPermission')}
            </Text>
            <Animated.View style={{ transform: [{ scale: settingsScale }] }}>
              <Pressable
                style={styles.settingsBtn}
                onPress={cameraPermission === null ? requestCameraPermission : openSettings}
                onPressIn={() => pressIn(settingsScale)}
                onPressOut={() => pressOut(settingsScale)}
                accessibilityRole="button"
                accessibilityLabel={t('finder.camera.openSettings')}
              >
                <Text style={styles.retryText}>{t('finder.camera.openSettings')}</Text>
              </Pressable>
            </Animated.View>
          </View>
        ) : photoUri ? (
          <>
            <PhotoPreviewImage uri={photoUri} />
            <Animated.View style={{ transform: [{ scale: retryScale }] }}>
              <Pressable
                style={styles.retryBtn}
                onPress={retryPhoto}
                onPressIn={() => pressIn(retryScale)}
                onPressOut={() => pressOut(retryScale)}
                accessibilityRole="button"
                accessibilityLabel={t('finder.camera.retry')}
              >
                <Text style={styles.retryText}>{t('finder.camera.retry')}</Text>
              </Pressable>
            </Animated.View>
          </>
        ) : (
          <>
            <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" />
            <Pressable
              style={styles.shutterBtn}
              onPress={takePicture}
              accessibilityRole="button"
              accessibilityLabel="Take photo"
            >
              <View style={styles.shutterInner} />
            </Pressable>
            <View style={styles.bracketTL} />
            <View style={styles.bracketTR} />
            <View style={styles.bracketBL} />
            <View style={styles.bracketBR} />
          </>
        )}
      </View>

      <Pressable
        style={styles.gpsBlock}
        onPress={goToLocation}
        accessibilityRole="button"
        accessibilityLabel="Set location"
      >
        <View style={styles.miniMapWrap}>
          {location ? (
            <MapView

              style={StyleSheet.absoluteFill}
              pointerEvents="none"
              region={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
              rotateEnabled={false}
              pitchEnabled={false}
            >
              <Marker
                coordinate={location}
                anchor={{ x: 0.5, y: 1 }}
                tracksViewChanges={false}
              />
            </MapView>
          ) : (
            <View style={styles.miniMapPlaceholder}>
              <View style={styles.pinIcon}>
                <View style={styles.pinHead} />
                <View style={styles.pinTail} />
              </View>
            </View>
          )}
        </View>

        <View style={styles.gpsInfo}>
          <Text style={[typography.label, styles.gpsLabel]}>GPS</Text>
          {gpsLoading ? (
            <Text style={[typography.bodyBold, styles.gpsStatus]}>{t('finder.camera.gpsLoading')}</Text>
          ) : location ? (
            <>
              <Text style={[typography.bodyBold, styles.gpsStatus]}>
                {locationSource === 'manual'
                  ? t('finder.camera.gpsManual')
                  : t('finder.camera.gpsAuto')}
              </Text>
              <Text style={[typography.caption, styles.gpsCoords]}>
                {location.latitude.toFixed(4)}° N · {location.longitude.toFixed(4)}° E
              </Text>
            </>
          ) : (
            <Text style={[typography.caption, styles.gpsNoAccess]}>
              {locationPermission === false
                ? t('finder.camera.gpsNoPermission')
                : t('finder.camera.gpsLoading')}
            </Text>
          )}
        </View>

        <View style={styles.gpsArrow}>
          <Text style={styles.gpsArrowText}>›</Text>
        </View>
      </Pressable>

      <View style={styles.ctaWrap}>
        <Button
          label={t('finder.camera.cta')}
          color={colors.finderPrimary}
          disabled={!canContinue}
          onPress={() => nav.navigate('Choice')}
        />
        <Text style={[typography.label, styles.ctaHint]}>{t('finder.camera.ctaHint')}</Text>
      </View>
    </View>
  );
}

function PhotoPreviewImage({ uri }: { uri: string }) {
  return <Image source={{ uri }} style={StyleSheet.absoluteFill} resizeMode="cover" />;
}

const BRACKET = 20;
const BRACKET_W = 2.5;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  cameraBlock: {
    flex: 1,
    backgroundColor: colors.accent,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionBox: {
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  permissionIcon: {
    width: 48,
    height: 48,
    backgroundColor: colors.finderPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  permIconBar: { width: 4, height: 18, backgroundColor: colors.textOnFinder },
  permIconDot: { width: 4, height: 4, backgroundColor: colors.textOnFinder },
  permissionText: { color: colors.textOnPrimary, textAlign: 'center' },
  shutterBtn: {
    position: 'absolute',
    bottom: spacing.xl,
    alignSelf: 'center',
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  shutterInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.surface,
  },
  settingsBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(20,19,15,0.75)',
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
  retryBtn: {
    position: 'absolute',
    bottom: spacing.xl,
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(20,19,15,0.75)',
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
  retryText: {
    fontFamily: fontFamily.bodyBlack,
    fontSize: 13,
    letterSpacing: 0.4,
    color: colors.surface,
  },
  bracketTL: {
    position: 'absolute', top: spacing.md, left: spacing.md,
    width: BRACKET, height: BRACKET,
    borderTopWidth: BRACKET_W, borderLeftWidth: BRACKET_W, borderColor: 'rgba(255,255,255,0.7)',
  },
  bracketTR: {
    position: 'absolute', top: spacing.md, right: spacing.md,
    width: BRACKET, height: BRACKET,
    borderTopWidth: BRACKET_W, borderRightWidth: BRACKET_W, borderColor: 'rgba(255,255,255,0.7)',
  },
  bracketBL: {
    position: 'absolute', bottom: spacing.md + 68 + spacing.md, left: spacing.md,
    width: BRACKET, height: BRACKET,
    borderBottomWidth: BRACKET_W, borderLeftWidth: BRACKET_W, borderColor: 'rgba(255,255,255,0.7)',
  },
  bracketBR: {
    position: 'absolute', bottom: spacing.md + 68 + spacing.md, right: spacing.md,
    width: BRACKET, height: BRACKET,
    borderBottomWidth: BRACKET_W, borderRightWidth: BRACKET_W, borderColor: 'rgba(255,255,255,0.7)',
  },
  gpsBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginTop: spacing.sm,
    marginHorizontal: spacing.screenMargin,
  },
  miniMapWrap: {
    width: 80,
    height: 72,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.borderSubtle,
    backgroundColor: colors.sageSoft,
  },
  miniMapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.sageSoft,
  },
  pinIcon: { alignItems: 'center' },
  pinHead: {
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: colors.accent, borderWidth: 2, borderColor: colors.accent,
  },
  pinTail: { width: 2, height: 8, backgroundColor: colors.accent },
  gpsInfo: { flex: 1, gap: 2 },
  gpsLabel: { color: colors.textSecondary },
  gpsStatus: { color: colors.textPrimary },
  gpsCoords: { color: colors.textSecondary },
  gpsNoAccess: { color: colors.textSecondary },
  gpsArrow: { paddingHorizontal: spacing.xs },
  gpsArrowText: {
    fontFamily: fontFamily.bodyBlack,
    fontSize: 22,
    color: colors.textSecondary,
  },
  ctaWrap: {
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.xs,
    backgroundColor: colors.background,
  },
  ctaHint: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
});
