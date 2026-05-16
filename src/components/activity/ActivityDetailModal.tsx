import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalization } from '../../contexts/LocalizationContext';
import { colors, spacing, typography } from '../../theme';
import { ScreenHeader } from '../ui';
import { ActivityItem } from './ActivityItemCard';

type ActivityDetailModalProps = {
  item: ActivityItem;
  onClose: () => void;
};

function isCompleted(item: ActivityItem) {
  return (
    item.statusKind === 'returned' ||
    item.statusKind === 'found' ||
    item.statusKind === 'closed'
  );
}

function isPossibleMatch(item: ActivityItem) {
  return item.statusKind === 'possibleMatch';
}

export default function ActivityDetailModal({ item, onClose }: ActivityDetailModalProps) {
  const { t } = useLocalization();
  const completed = isCompleted(item);
  const possibleMatch = isPossibleMatch(item);
  const accentColor = item.type === 'found' ? colors.finderPrimary : colors.loserPrimary;
  const detailTitle = possibleMatch
    ? t('activity.detail.denisTitle')
    : completed
      ? t('activity.detail.completedTitle')
      : t('activity.detail.noNewsTitle');
  const detailBody = possibleMatch
    ? t('activity.detail.denisBody')
    : completed
      ? t('activity.detail.completedBody')
      : t('activity.detail.noNewsBody');

  return (
    <Modal visible animationType="none" presentationStyle="fullScreen">
      <View style={styles.root}>
        <ScreenHeader
          title={t('activity.detail.title')}
          onBack={onClose}
          accentColor={possibleMatch ? colors.finderPrimary : accentColor}
        />

        <View style={styles.content}>
          <View
            style={[
              styles.heroCard,
              possibleMatch && styles.matchCard,
              completed && styles.completedCard,
            ]}
          >
            <View
              style={[
                styles.accentBar,
                { backgroundColor: completed ? colors.disabled : accentColor },
                possibleMatch && styles.matchAccent,
              ]}
            />

            <View style={styles.heroContent}>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={[styles.itemTitle, completed && styles.completedText]}>
                {item.title}
              </Text>

              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>{t('activity.detail.status')}</Text>
                <Text style={styles.statusValue}>{item.status}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{detailTitle}</Text>
            <Text style={styles.sectionBody}>{detailBody}</Text>
          </View>

          <View style={styles.metaGrid}>
            <DetailLine label={t('activity.detail.type')} value={t(item.type === 'found' ? 'activity.detail.foundType' : 'activity.detail.lostType')} />
            <DetailLine label={t('activity.detail.location')} value={item.locationLabel} />
            <DetailLine label={t('activity.detail.date')} value={item.dateLabel} />
          </View>

          <Pressable
            onPress={onClose}
            style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel={t('activity.detail.close')}
          >
            <Text style={styles.closeText}>{t('activity.detail.close')}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailLine}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.screenMargin,
    gap: spacing.md,
  },
  heroCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    minHeight: 150,
  },
  matchCard: {
    backgroundColor: colors.finderLight,
    borderColor: colors.finderPrimary,
  },
  completedCard: {
    backgroundColor: colors.borderSubtle,
    borderColor: colors.disabled,
  },
  accentBar: {
    width: 10,
  },
  matchAccent: {
    width: 16,
    backgroundColor: colors.finderPrimary,
  },
  heroContent: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.sm,
  },
  category: {
    ...typography.label,
    color: colors.textSecondary,
  },
  itemTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  completedText: {
    color: colors.textSecondary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  statusLabel: {
    ...typography.label,
    color: colors.textSecondary,
  },
  statusValue: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  section: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  sectionBody: {
    ...typography.body,
    color: colors.textSecondary,
  },
  metaGrid: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  detailLine: {
    padding: spacing.md,
    gap: spacing.xs,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.borderSubtle,
  },
  detailLabel: {
    ...typography.label,
    color: colors.textSecondary,
  },
  detailValue: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  closeButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    borderWidth: 1.5,
    borderColor: colors.accent,
    marginTop: 'auto',
  },
  closeText: {
    ...typography.button,
    color: colors.textOnPrimary,
  },
  pressed: {
    opacity: 0.55,
  },
});
