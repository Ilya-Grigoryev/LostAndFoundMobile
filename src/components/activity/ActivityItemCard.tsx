import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from '../ui';
import { colors, spacing, typography } from '../../theme';

export type ActivityStatusKind =
  | 'marked'
  | 'inFundbox'
  | 'returned'
  | 'active'
  | 'possibleMatch'
  | 'found'
  | 'closed';

export type ActivityItem = {
  id: string;
  type: 'found' | 'lost';
  statusKind: ActivityStatusKind;
  category: string;
  title: string;
  locationLabel: string;
  dateLabel: string;
  status: string;
};

type ActivityItemCardProps = {
  item: ActivityItem;
  onPress?: () => void;
};

function getStatusColors(statusKind: ActivityStatusKind) {
  if (statusKind === 'possibleMatch') {
    return {
      borderColor: colors.finderPrimary,
      backgroundColor: colors.finderPrimary,
      textColor: colors.textOnFinder,
    };
  }

  if (statusKind === 'inFundbox' || statusKind === 'found' || statusKind === 'returned') {
    return {
      borderColor: colors.success,
      backgroundColor: colors.surface,
      textColor: colors.success,
    };
  }

  if (statusKind === 'closed') {
    return {
      borderColor: colors.disabled,
      backgroundColor: colors.surface,
      textColor: colors.textSecondary,
    };
  }

  if (statusKind === 'marked') {
    return {
      borderColor: colors.accent,
      backgroundColor: colors.surface,
      textColor: colors.accent,
    };
  }

  return {
    borderColor: colors.loserPrimary,
    backgroundColor: colors.surface,
    textColor: colors.loserPrimary,
  };
}

export default function ActivityItemCard({ item, onPress }: ActivityItemCardProps) {
  const accentColor =
    item.type === 'found' ? colors.finderPrimary : colors.loserPrimary;
  const statusColors = getStatusColors(item.statusKind);
  const isHighlighted = item.statusKind === 'possibleMatch';
  const isCompleted =
    item.statusKind === 'returned' ||
    item.statusKind === 'found' ||
    item.statusKind === 'closed';

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={`${item.title}. ${item.status}`}
      style={[
        styles.pressable,
      ]}
    >
      <Card
        bordered
        style={[
          styles.card,
          isHighlighted && styles.highlightedCard,
          isCompleted && styles.completedCard,
        ]}
      >
        <View
          style={[
            styles.accentBar,
            isHighlighted && styles.highlightedAccentBar,
            { backgroundColor: isCompleted ? colors.disabled : accentColor },
          ]}
        />

        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={[styles.category, isCompleted && styles.mutedText]}>
              {item.category}
            </Text>
            <View
              style={[
                styles.statusBadge,
                {
                  borderColor: statusColors.borderColor,
                  backgroundColor: statusColors.backgroundColor,
                },
              ]}
            >
              <Text style={[styles.statusText, { color: statusColors.textColor }]}>
                {item.status}
              </Text>
            </View>
          </View>

          <Text style={[styles.title, isCompleted && styles.completedTitle]}>
            {item.title}
          </Text>
          <Text style={[styles.meta, isCompleted && styles.mutedText]}>
            {item.locationLabel}
          </Text>
          <Text style={[styles.meta, isCompleted && styles.mutedText]}>
            {item.dateLabel}
          </Text>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    alignSelf: 'stretch',
  },
  card: {
    flexDirection: 'row',
    padding: 0,
    overflow: 'hidden',
  },
  highlightedCard: {
    backgroundColor: colors.finderLight,
    borderColor: colors.finderPrimary,
  },
  completedCard: {
    backgroundColor: colors.borderSubtle,
  },
  accentBar: {
    width: 8,
  },
  highlightedAccentBar: {
    width: 12,
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
  completedTitle: {
    color: colors.textSecondary,
  },
  meta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  mutedText: {
    color: colors.disabled,
  },
});
