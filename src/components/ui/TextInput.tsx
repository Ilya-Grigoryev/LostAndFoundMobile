import React, { useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  TextInputProps,
  View,
} from 'react-native';
import { colors, radii, spacing, typography } from '../../theme';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  accentColor?: string;
}

export default function TextInput({
  label,
  error,
  leftIcon,
  style,
  accentColor = colors.loserPrimary,
  ...rest
}: Props) {
  const [focused, setFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setFocused(true);
    Animated.timing(borderAnim, { toValue: 1, duration: 150, useNativeDriver: false }).start();
    rest.onFocus?.({} as any);
  };

  const handleBlur = () => {
    setFocused(false);
    Animated.timing(borderAnim, { toValue: 0, duration: 150, useNativeDriver: false }).start();
    rest.onBlur?.({} as any);
  };

  const borderColor = error
    ? colors.error
    : borderAnim.interpolate({ inputRange: [0, 1], outputRange: [colors.border, accentColor] });

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text style={[styles.label, focused && { color: accentColor }]}>{label}</Text>
      )}
      <Animated.View style={[styles.inputRow, { borderColor }]}>
        {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
        <RNTextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.textSecondary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
      </Animated.View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.xs },
  label: { ...typography.label, color: colors.textSecondary },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    minHeight: 52,
    paddingHorizontal: spacing.md,
  },
  icon: { marginRight: spacing.sm },
  input: { flex: 1, ...typography.body, color: colors.textPrimary },
  error: { ...typography.caption, color: colors.error },
});
