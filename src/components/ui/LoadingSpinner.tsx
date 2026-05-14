import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors } from '../../theme';

interface LoadingSpinnerProps {
  color?: string;
  fullScreen?: boolean;
}

function Dot({ color, delay }: { color: string; delay: number }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration: 320, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 320, useNativeDriver: true }),
        Animated.delay(960 - delay * 2),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });
  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.25, 1] });

  return (
    <Animated.View
      style={[styles.dot, { backgroundColor: color, transform: [{ scale }], opacity }]}
    />
  );
}

export default function LoadingSpinner({
  color = colors.loserPrimary,
  fullScreen = false,
}: LoadingSpinnerProps) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <View style={styles.row}>
        <Dot color={color} delay={0} />
        <Dot color={color} delay={160} />
        <Dot color={color} delay={320} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', padding: 24 },
  fullScreen: { flex: 1 },
  row: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  dot: { width: 12, height: 12, borderRadius: 6 },
});
