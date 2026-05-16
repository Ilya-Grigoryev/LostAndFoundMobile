import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AddressMode from '../../components/location/AddressMode';
import StepByStepMode from '../../components/location/StepByStepMode';
import SubTabSwitcher, { SubTabOption } from '../../components/location/SubTabSwitcher';
import { Button, ProgressDots, ScreenHeader } from '../../components/ui';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useLoserReport } from '../../contexts/LoserReportContext';
import { LoserStackParamList } from '../../navigation/types';
import { colors, spacing } from '../../theme';

type Nav = NativeStackNavigationProp<LoserStackParamList, 'LocationAddress'>;
type AddressTab = 'steps' | 'address';

interface StepsValue {
  bezirk: number;
  street?: string;
  landmark?: string;
}

export default function LocationAddressScreen() {
  const nav = useNavigation<Nav>();
  const { t } = useLocalization();
  const { setLocation } = useLoserReport();

  const [tab, setTab] = useState<AddressTab>('steps');
  const [stepsValue, setStepsValue] = useState<StepsValue | null>(null);
  const [addressValue, setAddressValue] = useState<string | null>(null);

  const onStepsChange = useCallback((value: StepsValue | null) => setStepsValue(value), []);
  const onAddressChange = useCallback((value: { address: string } | null) => {
    setAddressValue(value?.address ?? null);
  }, []);

  const options: readonly [SubTabOption<AddressTab>, SubTabOption<AddressTab>] = [
    { value: 'steps', label: t('loser.tab.steps') },
    { value: 'address', label: t('loser.tab.address') },
  ];

  const canContinue =
    tab === 'steps' ? stepsValue !== null : addressValue !== null && addressValue.length > 0;

  const handleContinue = () => {
    if (tab === 'steps' && stepsValue) {
      setLocation({
        kind: 'steps',
        bezirk: stepsValue.bezirk,
        street: stepsValue.street,
        landmark: stepsValue.landmark,
      });
    } else if (tab === 'address' && addressValue) {
      setLocation({ kind: 'address', address: addressValue });
    }
    nav.navigate('Confirm');
  };

  return (
    <View style={styles.root}>
      <ScreenHeader
        title={t('loser.flow.title')}
        onBack={() => nav.goBack()}
        accentColor={colors.loserPrimary}
        rightAction={<ProgressDots total={4} current={3} activeColor={colors.loserPrimary} />}
      />

      <View style={styles.tabsWrap}>
        <SubTabSwitcher options={options} value={tab} onChange={setTab} />
      </View>

      <View style={styles.modeArea}>
        {tab === 'steps' ? (
          <StepByStepMode initial={stepsValue ?? undefined} onChange={onStepsChange} />
        ) : (
          <AddressMode
            initial={addressValue ? { address: addressValue } : undefined}
            onChange={onAddressChange}
          />
        )}
      </View>

      <View style={styles.cta}>
        <Button
          label={tab === 'steps' ? t('loser.steps.cta') : t('loser.address.cta')}
          color={colors.loserPrimary}
          disabled={!canContinue}
          onPress={handleContinue}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  tabsWrap: { paddingHorizontal: spacing.screenMargin, paddingVertical: spacing.sm },
  modeArea: { flex: 1 },
  cta: {
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
});
