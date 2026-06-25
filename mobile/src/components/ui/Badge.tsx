import { Text, View } from 'react-native'

type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info'

const TONES: Record<Tone, string> = {
  neutral: 'bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-200',
  brand:   'bg-brand-50 text-brand-700 dark:bg-brand-700/20 dark:text-brand-300',
  success: 'bg-success-100 text-success-600 dark:bg-success-500/20 dark:text-success-500',
  warning: 'bg-warning-100 text-warning-600 dark:bg-warning-500/20 dark:text-warning-500',
  danger:  'bg-danger-100 text-danger-600 dark:bg-danger-500/20 dark:text-danger-500',
  info:    'bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400',
}

export function Badge({ label, tone = 'neutral' }: { label: string; tone?: Tone }) {
  const cls = TONES[tone]
  const [bg, ...textCls] = cls.split(' ')
  return (
    <View className={`self-start rounded-full px-2.5 py-1 ${bg} ${cls.includes('dark:bg') ? cls.split(' ').filter((c) => c.startsWith('dark:bg')).join(' ') : ''}`}>
      <Text className={`text-xs font-semi ${textCls.filter((c) => c.startsWith('text-') || c.startsWith('dark:text-')).join(' ')}`}>
        {label}
      </Text>
    </View>
  )
}
