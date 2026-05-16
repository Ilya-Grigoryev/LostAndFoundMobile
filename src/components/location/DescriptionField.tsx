import React, { forwardRef, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  TextInputProps,
  View,
} from 'react-native';
import { colors, fontFamily, spacing, typography } from '../../theme';

interface DescriptionFieldProps
  extends Omit<TextInputProps, 'style' | 'multiline'> {
  label: string;
  meta: string;
  emphasizeMeta?: boolean;
  maxLength?: number;
}

const DescriptionField = forwardRef<RNTextInput, DescriptionFieldProps>(
  (
    { label, meta, emphasizeMeta = false, maxLength = 160, value, ...rest },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);
    const borderAnim = useRef(new Animated.Value(0)).current;

    const handleFocus = () => {
      setFocused(true);
      Animated.timing(borderAnim, { toValue: 1, duration: 150, useNativeDriver: false }).start();
      rest.onFocus?.({} as never);
    };

    const handleBlur = () => {
      setFocused(false);
      Animated.timing(borderAnim, { toValue: 0, duration: 150, useNativeDriver: false }).start();
      rest.onBlur?.({} as never);
    };

    const borderColor = borderAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.border, colors.loserPrimary],
    });

    const count = value?.length ?? 0;

    return (
      <View style={styles.wrap}>
        <View style={styles.head}>
          <Text style={[typography.label, styles.label, focused && styles.labelFocused]}>
            {label}
          </Text>
          <Text style={[styles.meta, emphasizeMeta && styles.metaEmphasis]}>
            {meta}
          </Text>
        </View>
        <Animated.View style={[styles.box, { borderColor }]}>
          <RNTextInput
            ref={ref}
            multiline
            maxLength={maxLength}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholderTextColor={colors.textSecondary}
            style={styles.input}
            {...rest}
          />
        </Animated.View>
        <Text style={styles.counter}>
          {count} / {maxLength}
        </Text>
      </View>
    );
  },
);

DescriptionField.displayName = 'DescriptionField';

export default DescriptionField;

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: spacing.sm,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
    letterSpacing: 2.8,
  },
  labelFocused: { color: colors.loserPrimary },
  meta: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
    letterSpacing: 0.4,
  },
  metaEmphasis: { color: colors.loserPrimary, fontFamily: fontFamily.bodyBold },
  box: {
    borderWidth: 1.5,
    backgroundColor: colors.surface,
    minHeight: 96,
    padding: spacing.md,
  },
  input: {
    ...typography.body,
    color: colors.textPrimary,
    padding: 0,
    minHeight: 64,
    textAlignVertical: 'top',
  },
  counter: {
    ...typography.caption,
    color: colors.textSecondary,
    alignSelf: 'flex-end',
    fontSize: 11,
  },
});
