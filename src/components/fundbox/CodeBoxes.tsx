import React, { useRef } from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput as RNTextInput,
  TextInputKeyPressEventData,
  View,
} from 'react-native';
import { colors, fontFamily } from '../../theme';

const CODE_LENGTH = 6;

interface CodeBoxesProps {
  value: string;
  onChange: (next: string) => void;
}

// Six geometric input boxes with a visual split after digit 3.
// Auto-advances focus on entry; backspace on an empty cell jumps to the
// previous one.
export default function CodeBoxes({ value, onChange }: CodeBoxesProps) {
  const refs = useRef<Array<RNTextInput | null>>([]);

  const setDigit = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, '').slice(-1);
    const next = value.padEnd(CODE_LENGTH, ' ').split('');
    next[index] = digit || ' ';
    onChange(next.join('').trimEnd());
    if (digit && index < CODE_LENGTH - 1) refs.current[index + 1]?.focus();
  };

  const handleKey = (
    index: number,
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    if (e.nativeEvent.key === 'Backspace') {
      const arr = value.padEnd(CODE_LENGTH, ' ').split('');
      if (arr[index] === ' ' && index > 0) {
        refs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <View style={styles.row}>
      {Array.from({ length: CODE_LENGTH }).map((_, i) => {
        const char = (value[i] ?? '').trim();
        const isFilled = !!char;
        return (
          <React.Fragment key={i}>
            {i === 3 && <View style={styles.split} />}
            <View
              style={[
                styles.box,
                {
                  backgroundColor: isFilled ? colors.finderLight : colors.surface,
                  borderColor: isFilled ? colors.accent : colors.border,
                },
              ]}
            >
              <RNTextInput
                ref={r => {
                  refs.current[i] = r;
                }}
                style={styles.input}
                keyboardType="number-pad"
                maxLength={1}
                value={char}
                onChangeText={t => setDigit(i, t)}
                onKeyPress={e => handleKey(i, e)}
                selectionColor={colors.accent}
                accessibilityLabel={`Stelle ${i + 1}`}
              />
            </View>
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  split: {
    width: 16,
  },
  box: {
    width: 44,
    height: 60,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontFamily: fontFamily.display,
    fontSize: 32,
    lineHeight: 34,
    color: colors.accent,
    padding: 0,
  },
});
