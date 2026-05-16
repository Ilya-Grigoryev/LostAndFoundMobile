import { CategoryId } from '../types/loser';
import { StringKey } from './strings';
import { colors } from '../theme';

export interface CategoryMeta {
  id: CategoryId;
  labelKey: StringKey;
  // Tile background tint pulled from the existing palette (no new tokens).
  tint: string;
}

export const categories: readonly CategoryMeta[] = [
  { id: 'backpack',  labelKey: 'loser.category.backpack',  tint: colors.loserLight },
  { id: 'keys',      labelKey: 'loser.category.keys',      tint: colors.finderLight },
  { id: 'wallet',    labelKey: 'loser.category.wallet',    tint: colors.sageSoft },
  { id: 'phone',     labelKey: 'loser.category.phone',     tint: colors.accentLight },
  { id: 'documents', labelKey: 'loser.category.documents', tint: colors.loserLight },
  { id: 'bicycle',   labelKey: 'loser.category.bicycle',   tint: colors.finderLight },
  { id: 'other',     labelKey: 'loser.category.other',     tint: colors.sageSoft },
] as const;

export function getCategoryMeta(id: CategoryId): CategoryMeta {
  const found = categories.find(c => c.id === id);
  if (!found) throw new Error(`Unknown category: ${id}`);
  return found;
}
