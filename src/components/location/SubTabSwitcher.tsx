import React, { useEffect, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../../theme';

export interface SubTabOption<T extends string> {
  value: T;
  label: string;
}

interface SubTabSwitcherProps<T extends string> {
  options: readonly [SubTabOption<T>, SubTabOption<T>];
  value: T;
  onChange: (value: T) => void;
  accentColor?: string;
}

// Two big rectangular buttons + a thick bar that springs between them.
// Sharp corners, no rounded radius — Bauhaus segmented control.
export default function SubTabSwitcher<T extends string>({
  options,
  value,
  onChange,
  accentColor = colors.loserPrimary,
}: SubTabSwitcherProps<T>) {
  const [width, setWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const activeIndex = options.findIndex(o => o.value === value);

  useEffect(() => {
    if (width === 0) return;
    Animated.spring(translateX, {
      toValue: activeIndex * (width / 2),
      useNativeDriver: true,
      speed: 18,
      bounciness: 6,
    }).start();
  }, [activeIndex, width, translateX]);

  const handleLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  return (
    <View style={styles.wrap} onLayout={handleLayout}>
      <View style={styles.row}>
        {options.map(opt => {
          const isActive = opt.value === value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => onChange(opt.value)}
              style={[styles.tab, isActive && { backgroundColor: accentColor }]}
              accessibilityRole="button"
              accessibilityLabel={opt.label}
              accessibilityState={{ selected: isActive }}
            >
              <Text
                style={[
                  styles.label,
                  { color: isActive ? colors.textOnLoser : colors.textPrimary },
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {width > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.indicator,
            {
              backgroundColor: accentColor,
              width: width / 2,
              transform: [{ translateX }],
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  row: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  label: {
    ...typography.button,
    fontSize: 13,
    letterSpacing: 0.4,
  },
  indicator: {
    height: 3,
    marginTop: -1.5,
  },
});
