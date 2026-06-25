import { Pressable, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ReactNode } from 'react'
import { palette } from '@/theme/tokens'

type Props = {
  title: string
  subtitle?: string
  back?: boolean
  right?: ReactNode
  /** Sticky frosted top header used inside scroll views. */
  variant?: 'standard' | 'large'
}

export function ScreenHeader({ title, subtitle, back, right, variant = 'standard' }: Props) {
  const router = useRouter()
  return (
    <SafeAreaView edges={['top']} className="bg-ink-50 dark:bg-ink-950">
      <View className="px-5 pt-2 pb-3 flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          {back && (
            <Pressable
              hitSlop={12}
              onPress={() => router.back()}
              className="mr-2 w-10 h-10 rounded-full items-center justify-center bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800"
            >
              <MaterialIcons name="arrow-back" size={22} color={palette.ink[700]} />
            </Pressable>
          )}
          <View className="flex-1">
            <Text
              numberOfLines={1}
              className={
                variant === 'large'
                  ? 'text-3xl font-bold text-ink-900 dark:text-ink-50'
                  : 'text-lg font-semi text-ink-900 dark:text-ink-50'
              }
            >
              {title}
            </Text>
            {subtitle && (
              <Text className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">{subtitle}</Text>
            )}
          </View>
        </View>
        {right && <View className="ml-2">{right}</View>}
      </View>
    </SafeAreaView>
  )
}
