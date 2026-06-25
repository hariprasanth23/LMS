import { Text, View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { ReactNode } from 'react'
import { palette } from '@/theme/tokens'

type Props = {
  icon?: keyof typeof MaterialIcons.glyphMap
  title: string
  message?: string
  action?: ReactNode
}

export function EmptyState({ icon = 'inbox', title, message, action }: Props) {
  return (
    <View className="items-center justify-center py-12 px-6">
      <View
        style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: palette.ink[100] }}
        className="dark:bg-ink-800 items-center justify-center"
      >
        <MaterialIcons name={icon} size={36} color={palette.ink[400]} />
      </View>
      <Text className="mt-4 text-lg font-semi text-ink-900 dark:text-ink-50 text-center">{title}</Text>
      {message && (
        <Text className="mt-1 text-sm text-ink-500 dark:text-ink-400 text-center max-w-xs">
          {message}
        </Text>
      )}
      {action && <View className="mt-4">{action}</View>}
    </View>
  )
}
