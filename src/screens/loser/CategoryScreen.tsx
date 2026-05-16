import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CategoryTile from '../../components/location/CategoryTile';
import { ScreenHeader } from '../../components/ui';
import { categories } from '../../constants/categories';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useLoserReport } from '../../contexts/LoserReportContext';
import { LoserStackParamList } from '../../navigation/types';
import { CategoryId } from '../../types/loser';
import { colors, fontFamily, spacing, typography } from '../../theme';

type Nav = NativeStackNavigationProp<LoserStackParamList, 'Category'>;

export default function CategoryScreen() {
  const nav = useNavigation<Nav>();
  const { t } = useLocalization();
  const { category, setCategory } = useLoserReport();

  const handlePick = (id: CategoryId) => {
    setCategory(id);
    nav.navigate('LocationMode');
  };

  // 6 specific categories form a 2-col grid; "other" stretches full width below.
  const grid = categories.filter(c => c.id !== 'other');
  const other = categories.find(c => c.id === 'other')!;

  return (
    <View style={styles.root}>
      <ScreenHeader
        title=" "
        onBack={() => nav.getParent()?.goBack()}
        accentColor={colors.loserPrimary}
      />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.heading}>
          <Text style={[typography.label, styles.eyebrow]}>01 — {t('loser.category.title').toUpperCase()}</Text>
          <Text style={styles.title}>{t('loser.category.title')}</Text>
          <Text style={[typography.body, styles.subtitle]}>{t('loser.category.subtitle')}</Text>
        </View>

        <View style={styles.grid}>
          {grid.map(c => (
            <CategoryTile
              key={c.id}
              id={c.id}
              label={t(c.labelKey)}
              tint={c.tint}
              selected={category === c.id}
              onPress={() => handlePick(c.id)}
            />
          ))}
          <CategoryTile
            id={other.id}
            label={t(other.labelKey)}
            tint={other.tint}
            selected={category === other.id}
            fullWidth
            onPress={() => handlePick(other.id)}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: {
    paddingHorizontal: spacing.screenMargin,
    paddingBottom: spacing.xl,
  },
  heading: {
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  eyebrow: {
    color: colors.loserPrimary,
    letterSpacing: 2.8,
  },
  title: {
    fontFamily: fontFamily.display,
    fontSize: 42,
    lineHeight: 44,
    letterSpacing: -2,
    color: colors.textPrimary,
  },
  subtitle: {
    color: colors.textSecondary,
    paddingRight: spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
