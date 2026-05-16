import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../ui';
import { colors, spacing, typography } from '../../theme';

export type ActivityItem = {
  id: string;
  type: 'found' | 'lost';
  category: string;
  title: string;
  locationLabel: string;
  dateLabel: string;
  status: string;
};

type ActivityItemCardProps = {
  item: ActivityItem;
};

export default function ActivityItemCard({ item }: ActivityItemCardProps) {
  const accentColor =
    item.type === 'found' ? colors.finderPrimary : colors.loserPrimary;

  return (
    <Card bordered style={styles.card}>
      <View style={[styles.accentBar, { backgroundColor: accentColor }]} />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.category}>{item.category}</Text>
          <View style={[styles.statusBadge, { borderColor: accentColor }]}>
            <Text style={[styles.statusText, { color: accentColor }]}>
              {item.status}
            </Text>
          </View>
        </View>

        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.meta}>{item.locationLabel}</Text>
        <Text style={styles.meta}>{item.dateLabel}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 0,
    overflow: 'hidden',
  },
  accentBar: {
    width: 8,
  },
  content: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.xs,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  category: {
    flex: 1,
    ...typography.label,
    color: colors.textSecondary,
  },
  statusBadge: {
    borderWidth: 1.5,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  statusText: {
    ...typography.label,
    fontSize: 9,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  meta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});