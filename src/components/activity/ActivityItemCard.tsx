import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from '../ui';
import { CategoryId } from '../../types/loser';
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
  // For possible-match items: details of the found item, shown before claiming (ISSUE-02).
  matchDescription?: string;
  matchPhotoUri?: string;
  // For the user's own reports: lets the report form be reopened pre-filled (ISSUE-03).
  categoryId?: CategoryId;
};

type ActivityItemCardProps = {
  item: ActivityItem;
  onPress?: () => void;
  // When set, a pencil button is shown so the report can be reopened for editing (ISSUE-03).
  onEdit?: () => void;
  editLabel?: string;
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

export default function ActivityItemCard({ item, onPress, onEdit, editLabel }: ActivityItemCardProps) {
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

        {onEdit ? (
          <Pressable
            onPress={onEdit}
            hitSlop={10}
            style={styles.editButton}
            accessibilityRole="button"
            accessibilityLabel={editLabel}
          >
            <MaterialCommunityIcons name="pencil" size={18} color={colors.loserPrimary} />
          </Pressable>
        ) : null}
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
  editButton: {
    position: 'absolute',
    right: spacing.sm,
    bottom: spacing.sm,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.loserPrimary,
    backgroundColor: colors.surface,
  },
});
