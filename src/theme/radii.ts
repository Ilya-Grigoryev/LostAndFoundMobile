// Bauhaus uses sharp corners as primary — `none` is the default for blocks.
// Small radii reserved for inputs/chips where total sharpness hurts usability.

export const radii = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 8,
  pill: 9999,
} as const;
