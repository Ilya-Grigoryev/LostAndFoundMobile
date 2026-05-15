import React, { useRef } from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  TextInputKeyPressEventData,
  View,
} from 'react-native';
import { colors, fontFamily } from '../../theme';

const CODE_LENGTH = 6;

interface DisplayProps {
  mode: 'display';
  code: string;
  fillColor?: string;
}

interface InputProps {
  mode: 'input';
  value: string;
  onChange: (next: string) => void;
}

type Props = DisplayProps | InputProps;

// Six geometric boxes with a visual split after digit 3.
// In display mode each cell is a poster-style numeral; in input mode each
// is its own single-digit field with auto-advance focus.
export default function CodeBoxes(props: Props) {
  const refs = useRef<Array<RNTextInput | null>>([]);

  const setDigit = (index: number, raw: string) => {
    if (props.mode !== 'input') return;
    const digit = raw.replace(/\D/g, '').slice(-1);
    const next = props.value.padEnd(CODE_LENGTH, ' ').split('');
    next[index] = digit || ' ';
    const joined = next.join('').trimEnd();
    props.onChange(joined);
    if (digit && index < CODE_LENGTH - 1) refs.current[index + 1]?.focus();
  };

  const handleKey = (
    index: number,
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    if (props.mode !== 'input') return;
    if (e.nativeEvent.key === 'Backspace') {
      const arr = props.value.padEnd(CODE_LENGTH, ' ').split('');
      if (arr[index] === ' ' && index > 0) {
        refs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <View style={styles.row}>
      {Array.from({ length: CODE_LENGTH }).map((_, i) => {
        const isSplit = i === 3;
        const char = props.mode === 'display' ? props.code[i] ?? '' : props.value[i] ?? '';
        const isFilled = !!char && char !== ' ';
        const fill =
          props.mode === 'display' && isFilled
            ? props.fillColor ?? colors.finderPrimary
            : isFilled
            ? colors.finderLight
            : colors.surface;

        return (
          <React.Fragment key={i}>
            {isSplit && <View style={styles.split} />}
            <View
              style={[
                styles.box,
                { backgroundColor: fill, borderColor: isFilled ? colors.accent : colors.border },
              ]}
            >
              {props.mode === 'display' ? (
                <Text style={styles.digit}>{char}</Text>
              ) : (
                <RNTextInput
                  ref={r => {
                    refs.current[i] = r;
                  }}
                  style={styles.input}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={char.trim()}
                  onChangeText={t => setDigit(i, t)}
                  onKeyPress={e => handleKey(i, e)}
                  selectionColor={colors.accent}
                  accessibilityLabel={`Stelle ${i + 1}`}
                />
              )}
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
  digit: {
    fontFamily: fontFamily.display,
    fontSize: 32,
    lineHeight: 34,
    letterSpacing: -1.5,
    color: colors.accent,
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
