/**
 * Design tokens.
 *
 * NativeWind picks colours up from tailwind.config.js, but we also expose
 * them here so JS code (charts, gradients, icon colours) can stay in sync.
 * If you touch tokens, update tailwind.config.js too.
 */

export const palette = {
  // Surfaces
  ink: {
    50:  '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },
  brand: {
    50:  '#EEF2FF',
    100: '#E0E7FF',
    300: '#A5B4FC',
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
  },
  portal: {
    student: '#3B82F6',
    faculty: '#8B5CF6',
    parent:  '#F59E0B',
  },
  semantic: {
    success: '#22C55E',
    warning: '#F59E0B',
    danger:  '#EF4444',
    info:    '#0EA5E9',
  },
} as const

export const theme = {
  light: {
    background:        palette.ink[50],
    backgroundElevated: '#FFFFFF',
    surface:           '#FFFFFF',
    surfaceMuted:      palette.ink[100],
    border:            palette.ink[200],
    text:              palette.ink[900],
    textMuted:         palette.ink[500],
    textInverse:       '#FFFFFF',
    primary:           palette.brand[600],
  },
  dark: {
    background:        palette.ink[950],
    backgroundElevated: palette.ink[900],
    surface:           palette.ink[900],
    surfaceMuted:      palette.ink[800],
    border:            palette.ink[800],
    text:              palette.ink[50],
    textMuted:         palette.ink[400],
    textInverse:       palette.ink[900],
    primary:           palette.brand[500],
  },
} as const

export type ThemeMode = keyof typeof theme
export type ThemeColors = (typeof theme)[ThemeMode]

export const PORTAL_COLORS: Record<PortalKey, string> = {
  STUDENT: palette.portal.student,
  FACULTY: palette.portal.faculty,
  PARENT:  palette.portal.parent,
}

export type PortalKey = 'STUDENT' | 'FACULTY' | 'PARENT'

export const PORTAL_LABELS: Record<PortalKey, string> = {
  STUDENT: 'Student',
  FACULTY: 'Faculty',
  PARENT:  'Parent',
}

// Spacing scale (multiples of 4, mirrors Tailwind's defaults).
export const spacing = {
  1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48, 16: 64,
} as const

// Common radii.
export const radius = {
  sm: 8, md: 12, lg: 16, xl: 20, '2xl': 24, '3xl': 32, full: 9999,
} as const

// Type ramps — pair with Tailwind's text-* classes for size, here is line-height.
export const fontSize = {
  caption: 12,
  body:    14,
  lead:    16,
  h3:      18,
  h2:      22,
  h1:      28,
  display: 34,
} as const
