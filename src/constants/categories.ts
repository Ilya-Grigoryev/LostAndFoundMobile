import type { ComponentProps } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { CategoryId } from '../types/loser';
import { StringKey } from './strings';
import { colors } from '../theme';

export type MciIconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export interface CategoryMeta {
  id: CategoryId;
  labelKey: StringKey;
  iconName: MciIconName;
  // Tile background tint pulled from the existing palette (no new tokens).
  tint: string;
}

export const categories: readonly CategoryMeta[] = [
  { id: 'phone',      labelKey: 'loser.category.phone',      iconName: 'cellphone',         tint: colors.loserLight },
  { id: 'keys',       labelKey: 'loser.category.keys',       iconName: 'key-variant',       tint: colors.finderLight },
  { id: 'wallet',     labelKey: 'loser.category.wallet',     iconName: 'wallet',            tint: colors.sageSoft },
  { id: 'umbrella',   labelKey: 'loser.category.umbrella',   iconName: 'umbrella',          tint: colors.accentLight },
  { id: 'headphones', labelKey: 'loser.category.headphones', iconName: 'headphones',        tint: colors.loserLight },
  { id: 'glasses',    labelKey: 'loser.category.glasses',    iconName: 'glasses',           tint: colors.finderLight },
  { id: 'other',      labelKey: 'loser.category.other',      iconName: 'dots-horizontal',   tint: colors.sageSoft },
] as const;

export function getCategoryMeta(id: CategoryId): CategoryMeta {
  const found = categories.find(c => c.id === id);
  if (!found) throw new Error(`Unknown category: ${id}`);
  return found;
}
