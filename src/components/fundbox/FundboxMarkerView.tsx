import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors } from '../../theme';

interface FundboxMarkerViewProps {
  active: boolean;
}

const HIT_AREA = 48;

export default function FundboxMarkerView({ active }: FundboxMarkerViewProps) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1100, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [active, pulse]);

  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 2.2] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0] });
  const size = active ? 32 : 24;

  return (
    <View style={styles.wrap}>
      {active && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.pulseRing,
            {
              width: size,
              height: size,
              opacity: ringOpacity,
              transform: [{ scale: ringScale }],
              borderColor: colors.finderPrimary,
            },
          ]}
        />
      )}
      <View
        style={[
          styles.box,
          {
            width: size,
            height: size,
            backgroundColor: active ? colors.finderPrimary : colors.surface,
            borderColor: active ? colors.accent : colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.innerDot,
            { backgroundColor: active ? colors.accent : colors.finderPrimary },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: HIT_AREA,
    height: HIT_AREA,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    borderWidth: 2,
  },
  box: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerDot: {
    width: 6,
    height: 6,
  },
});
