import { useColorScheme as useRNColorScheme } from 'react-native'
import { theme, ThemeMode } from './tokens'

/**
 * Wrapper around RN's useColorScheme so JS code can pull the same colour
 * objects we exposed in tokens.ts and stay aligned with NativeWind.
 */
export function useTheme() {
  const mode = (useRNColorScheme() ?? 'light') as ThemeMode
  return { mode, colors: theme[mode] }
}
