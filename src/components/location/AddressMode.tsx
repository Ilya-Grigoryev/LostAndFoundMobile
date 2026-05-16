import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TextInput } from '../../components/ui';
import { useLocalization } from '../../contexts/LocalizationContext';
import { searchAddresses } from '../../constants/viennaBezirke';
import { colors, fontFamily, spacing, typography } from '../../theme';

interface AddressValue {
  address: string;
}

interface AddressModeProps {
  initial?: AddressValue;
  onChange: (value: AddressValue | null) => void;
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

export default function AddressMode({ initial, onChange }: AddressModeProps) {
  const { t } = useLocalization();
  const [query, setQuery] = useState<string>(initial?.address ?? '');
  const [picked, setPicked] = useState<string | null>(initial?.address ?? null);

  const suggestions = useMemo(() => {
    if (picked && query === picked) return [];
    return searchAddresses(query, 5);
  }, [query, picked]);

  useEffect(() => {
    onChange(picked ? { address: picked } : null);
  }, [picked, onChange]);

  const handleChangeText = (text: string) => {
    setQuery(text);
    if (picked && text !== picked) setPicked(null);
  };

  const handlePick = (street: string, bezirkNumber: number) => {
    const full = `${street}, ${pad(bezirkNumber)}. Bezirk`;
    setQuery(full);
    setPicked(full);
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[typography.label, styles.eyebrow]}>{t('loser.address.title')}</Text>
      <TextInput
        placeholder={t('loser.address.placeholder')}
        value={query}
        onChangeText={handleChangeText}
        autoCorrect={false}
        accentColor={colors.loserPrimary}
      />

      {!picked && query.trim().length >= 2 && (
        <View style={styles.results}>
          {suggestions.length === 0 ? (
            <Text style={[typography.caption, styles.empty]}>{t('loser.address.noResults')}</Text>
          ) : (
            suggestions.map(s => (
              <Pressable
                key={`${s.bezirk.number}-${s.street}`}
                onPress={() => handlePick(s.street, s.bezirk.number)}
                style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
                accessibilityRole="button"
              >
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{pad(s.bezirk.number)}</Text>
                </View>
                <View style={styles.rowText}>
                  <Text style={styles.street}>{s.street}</Text>
                  <Text style={styles.district}>{s.bezirk.name}</Text>
                </View>
              </Pressable>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: spacing.screenMargin,
    gap: spacing.sm,
    paddingBottom: spacing.xl,
  },
  eyebrow: { color: colors.loserPrimary, letterSpacing: 2.4 },
  results: { gap: spacing.xs, marginTop: spacing.sm },
  empty: { color: colors.textSecondary, paddingVertical: spacing.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  rowPressed: { backgroundColor: colors.loserLight },
  badge: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.loserPrimary,
  },
  badgeText: {
    fontFamily: fontFamily.display,
    fontSize: 16,
    lineHeight: 16,
    color: colors.loserPrimary,
  },
  rowText: { flex: 1, gap: 2 },
  street: { ...typography.bodyBold, color: colors.textPrimary },
  district: { ...typography.caption, color: colors.textSecondary },
});
