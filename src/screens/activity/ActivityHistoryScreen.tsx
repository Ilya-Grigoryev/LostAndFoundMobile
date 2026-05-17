import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import ActivityDetailModal from '../../components/activity/ActivityDetailModal';
import ActivityItemCard, {
  ActivityItem,
} from '../../components/activity/ActivityItemCard';
import { ScreenHeader } from '../../components/ui';
import { MainStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';
import { useLocalization } from '../../contexts/LocalizationContext';

type ActivityTab = 'found' | 'lost';

type ActivityHistoryNav = NativeStackNavigationProp<
  MainStackParamList,
  'ActivityHistory'
>;


export default function ActivityHistoryScreen() {
  const navigation = useNavigation<ActivityHistoryNav>();
  const [activeTab, setActiveTab] = useState<ActivityTab>('found');
  const [selectedItem, setSelectedItem] = useState<ActivityItem | null>(null);
  const { t } = useLocalization();

  const foundItems: ActivityItem[] = [
    {
      id: 'found-keys',
      type: 'found',
      statusKind: 'inFundbox',
      category: t('activity.found.keys.category'),
      title: t('activity.found.keys.title'),
      locationLabel: t('activity.found.keys.location'),
      dateLabel: t('activity.found.keys.date'),
      status: t('activity.found.keys.status'),
    },
    {
      id: 'found-wallet',
      type: 'found',
      statusKind: 'marked',
      category: t('activity.found.wallet.category'),
      title: t('activity.found.wallet.title'),
      locationLabel: t('activity.found.wallet.location'),
      dateLabel: t('activity.found.wallet.date'),
      status: t('activity.found.wallet.status'),
    },
    {
      id: 'found-phone',
      type: 'found',
      statusKind: 'returned',
      category: t('activity.found.phone.category'),
      title: t('activity.found.phone.title'),
      locationLabel: t('activity.found.phone.location'),
      dateLabel: t('activity.found.phone.date'),
      status: t('activity.found.phone.status'),
    },
  ];

  const lostItems: ActivityItem[] = [
    {
      id: 'lost-documents',
      type: 'lost',
      statusKind: 'possibleMatch',
      category: t('activity.lost.documents.category'),
      title: t('activity.lost.documents.title'),
      locationLabel: t('activity.lost.documents.location'),
      dateLabel: t('activity.lost.documents.date'),
      status: t('activity.lost.documents.status'),
    },
    {
      id: 'lost-backpack',
      type: 'lost',
      statusKind: 'possibleMatch',
      category: t('activity.lost.backpack.category'),
      title: t('activity.lost.backpack.title'),
      locationLabel: t('activity.lost.backpack.location'),
      dateLabel: t('activity.lost.backpack.date'),
      status: t('activity.lost.backpack.matchStatus'),
    },
    {
      id: 'lost-scarf',
      type: 'lost',
      statusKind: 'active',
      category: t('activity.lost.scarf.category'),
      title: t('activity.lost.scarf.title'),
      locationLabel: t('activity.lost.scarf.location'),
      dateLabel: t('activity.lost.scarf.date'),
      status: t('activity.lost.scarf.status'),
    },
    {
      id: 'lost-wallet',
      type: 'lost',
      statusKind: 'found',
      category: t('activity.lost.wallet.category'),
      title: t('activity.lost.wallet.title'),
      locationLabel: t('activity.lost.wallet.location'),
      dateLabel: t('activity.lost.wallet.date'),
      status: t('activity.lost.wallet.status'),
    },
    {
      id: 'lost-bike',
      type: 'lost',
      statusKind: 'closed',
      category: t('activity.lost.bike.category'),
      title: t('activity.lost.bike.title'),
      locationLabel: t('activity.lost.bike.location'),
      dateLabel: t('activity.lost.bike.date'),
      status: t('activity.lost.bike.status'),
    },
  ];

  const activeItems = activeTab === 'found' ? foundItems : lostItems;
  const accentColor =
    activeTab === 'found' ? colors.finderPrimary : colors.loserPrimary;

  return (
    <View style={styles.root}>
      <ScreenHeader
        title={t('activity.title')}
        onBack={() => navigation.goBack()}
        accentColor={accentColor}
      />

      <View style={styles.tabs}>
        <TabButton
          label={t('activity.tab.found')}
          active={activeTab === 'found'}
          color={colors.finderPrimary}
          onPress={() => setActiveTab('found')}
        />
        <TabButton
          label={t('activity.tab.lost')}
          active={activeTab === 'lost'}
          color={colors.loserPrimary}
          onPress={() => setActiveTab('lost')}
        />
      </View>

      <FlatList
        data={activeItems}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ActivityItemCard item={item} onPress={() => setSelectedItem(item)} />
        )}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {selectedItem ? (
        <ActivityDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      ) : null}
    </View>
  );
}

type TabButtonProps = {
  label: string;
  active: boolean;
  color: string;
  onPress: () => void;
};

function TabButton({ label, active, color, onPress }: TabButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.tabButton,
        active
          ? { backgroundColor: color, borderColor: color }
          : { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
    >
      <Text
        style={[
          styles.tabText,
          { color: active ? colors.textOnPrimary : colors.textPrimary },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.screenMargin,
    paddingBottom: spacing.sm,
  },
  tabButton: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    paddingHorizontal: spacing.sm,
  },
  tabText: {
    ...typography.button,
    textAlign: 'center',
  },
  listContent: {
    padding: spacing.screenMargin,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  separator: {
    height: spacing.md,
  },
});
