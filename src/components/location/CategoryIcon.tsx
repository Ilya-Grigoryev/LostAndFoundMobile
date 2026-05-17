import React from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { CategoryId } from '../../types/loser';
import { getCategoryMeta } from '../../constants/categories';
import { colors } from '../../theme';

interface CategoryIconProps {
  id: CategoryId;
  color?: string;
  size?: number;
}

export default function CategoryIcon({
  id,
  color = colors.textPrimary,
  size = 44,
}: CategoryIconProps) {
  const meta = getCategoryMeta(id);
  return <MaterialCommunityIcons name={meta.iconName} size={size} color={color} />;
}
