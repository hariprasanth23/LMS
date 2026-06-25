/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // ── Design tokens — mirror src/theme/tokens.ts ──────────────────────────
      colors: {
        // Base surfaces
        ink:     { 50: '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0', 300: '#CBD5E1',
                   400: '#94A3B8', 500: '#64748B', 600: '#475569', 700: '#334155',
                   800: '#1E293B', 900: '#0F172A', 950: '#020617' },
        // Brand — indigo
        brand:   { 50: '#EEF2FF', 100: '#E0E7FF', 200: '#C7D2FE', 300: '#A5B4FC',
                   400: '#818CF8', 500: '#6366F1', 600: '#4F46E5', 700: '#4338CA',
                   800: '#3730A3', 900: '#312E81' },
        // Portal accents (admin is red, omitted — mobile is student/faculty/parent)
        student: '#3B82F6', // blue
        faculty: '#8B5CF6', // violet
        parent:  '#F59E0B', // amber
        // Semantic
        success: { 100: '#DCFCE7', 500: '#22C55E', 600: '#16A34A' },
        warning: { 100: '#FEF3C7', 500: '#F59E0B', 600: '#D97706' },
        danger:  { 100: '#FEE2E2', 500: '#EF4444', 600: '#DC2626' },
      },
      fontFamily: {
        sans:    ['Inter_400Regular',  'system-ui'],
        medium:  ['Inter_500Medium',   'system-ui'],
        semi:    ['Inter_600SemiBold', 'system-ui'],
        bold:    ['Inter_700Bold',     'system-ui'],
      },
      borderRadius: {
        '2.5xl': '20px',
        '3xl':   '24px',
        '4xl':   '32px',
      },
    },
  },
  plugins: [],
}
