import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  color?: string;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  withArrow?: boolean;
}

function textOnAccent(accent: string): string {
  // Mustard yellow needs dark text; other accents take white
  return accent === colors.finderPrimary ? colors.textOnFinder : colors.textOnLoser;
}

export default function Button({
  label,
  onPress,
  variant = 'primary',
  color,
  disabled = false,
  loading = false,
  fullWidth = true,
  withArrow = true,
}: ButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const accent = color ?? colors.loserPrimary;

  let bg: string, labelColor: string, borderColor: string, arrowBg: string, arrowColor: string;

  if (variant === 'primary') {
    bg = accent;
    labelColor = textOnAccent(accent);
    borderColor = accent;
    arrowBg = colors.textPrimary;
    arrowColor = colors.textOnPrimary;
  } else if (variant === 'secondary') {
    bg = colors.surface;
    labelColor = colors.textPrimary;
    borderColor = colors.border;
    arrowBg = accent;
    arrowColor = textOnAccent(accent);
  } else {
    bg = 'transparent';
    labelColor = accent;
    borderColor = 'transparent';
    arrowBg = 'transparent';
    arrowColor = accent;
  }

  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 60, bounciness: 2 }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 60, bounciness: 2 }).start();

  return (
    <Animated.View style={[fullWidth && styles.fullWidth, { transform: [{ scale }] }]}>
      <Pressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        disabled={disabled || loading}
        style={[
          styles.row,
          { backgroundColor: bg, borderColor },
          variant !== 'ghost' && styles.bordered,
          (disabled || loading) && styles.disabled,
        ]}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
      >
        <View style={styles.labelBox}>
          <Text style={[styles.label, { color: labelColor }]}>
            {loading ? '· · ·' : label}
          </Text>
        </View>
        {withArrow && variant !== 'ghost' && (
          <View style={[styles.arrowBox, { backgroundColor: arrowBg }]}>
            <Text style={[styles.arrow, { color: arrowColor }]}>→</Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fullWidth: { alignSelf: 'stretch' },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: 52,
    borderRadius: radii.none,
  },
  bordered: { borderWidth: 1.5 },
  labelBox: {
    flex: 1,
    paddingHorizontal: spacing.md,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  label: { ...typography.button },
  arrowBox: {
    width: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: { fontFamily: typography.button.fontFamily, fontSize: 20 },
  disabled: { opacity: 0.4 },
});
