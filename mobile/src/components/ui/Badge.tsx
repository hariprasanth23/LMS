import { Text, View } from 'react-native'

type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info'

const TONES: Record<Tone, { container: string; text: string }> = {
  neutral: { container: 'bg-ink-100     dark:bg-ink-800',         text: 'text-ink-700    dark:text-ink-200' },
  brand:   { container: 'bg-brand-50    dark:bg-brand-700/20',    text: 'text-brand-700  dark:text-brand-300' },
  success: { container: 'bg-success-100 dark:bg-success-500/20',  text: 'text-success-600 dark:text-success-500' },
  warning: { container: 'bg-warning-100 dark:bg-warning-500/20',  text: 'text-warning-600 dark:text-warning-500' },
  danger:  { container: 'bg-danger-100  dark:bg-danger-500/20',   text: 'text-danger-600 dark:text-danger-500' },
  info:    { container: 'bg-sky-100     dark:bg-sky-500/20',      text: 'text-sky-600    dark:text-sky-400' },
}

export function Badge({ label, tone = 'neutral' }: { label: string; tone?: Tone }) {
  const t = TONES[tone]
  return (
    <View className={`self-start rounded-full px-2.5 py-1 ${t.container}`}>
      <Text className={`text-xs font-semi ${t.text}`}>{label}</Text>
    </View>
  )
}
