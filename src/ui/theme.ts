/**
 * One source of truth for colour, spacing and type. Screens import from here so
 * the app reads as a single product rather than five separately-styled screens.
 */
export const theme = {
  color: {
    bg: '#0B0F14',
    surface: '#141B23',
    surfaceAlt: '#1C2530',
    border: '#243040',
    text: '#E8EEF4',
    textMuted: '#93A4B5',
    accent: '#4ADE80',      // the saving — used for money, sparingly
    accentDim: '#1B3A2A',
    warn: '#FBBF24',
    danger: '#F87171',
    // Confidence badges. These carry meaning, so they never double as decoration.
    statute: '#4ADE80',
    published: '#60A5FA',
    needsCheck: '#FBBF24',
    unverified: '#93A4B5',
  },
  space: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 8, md: 12, lg: 16 },
  font: {
    display: { fontSize: 40, fontWeight: '700' as const, letterSpacing: -1 },
    title: { fontSize: 24, fontWeight: '700' as const },
    heading: { fontSize: 17, fontWeight: '600' as const },
    body: { fontSize: 15, fontWeight: '400' as const },
    small: { fontSize: 13, fontWeight: '400' as const },
    mono: { fontSize: 13, fontWeight: '500' as const },
  },
} as const;

import type { Confidence } from '../types.ts';

export const confidenceColor = (c: Confidence): string =>
  c === 'statute' ? theme.color.statute
  : c === 'published' ? theme.color.published
  : c === 'needs_check' ? theme.color.needsCheck
  : theme.color.unverified;

export const confidenceLabel = (c: Confidence): string =>
  c === 'statute' ? 'Guaranteed by state law'
  : c === 'published' ? 'Published policy'
  : c === 'needs_check' ? 'Needs confirming'
  : 'Unverified';

export const money = (n: number): string =>
  `$${Math.round(n).toLocaleString('en-US')}`;
