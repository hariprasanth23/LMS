import { Pressable, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
import { palette, PORTAL_COLORS, PORTAL_LABELS } from '@/theme/tokens'
import { PortalKey } from '@/types'
import * as Haptics from 'expo-haptics'

type Option = {
  key: PortalKey
  icon: keyof typeof MaterialIcons.glyphMap
  description: string
}

const OPTIONS: Option[] = [
  { key: 'STUDENT', icon: 'school',     description: 'Courses, attendance, fees, results' },
  { key: 'FACULTY', icon: 'badge',      description: 'Classes, attendance marking, leave' },
  { key: 'PARENT',  icon: 'people',     description: "Ward's progress and announcements" },
]

export default function PortalPicker() {
  const router = useRouter()

  const select = (portal: PortalKey) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    router.push({ pathname: '/(auth)/login', params: { portal } })
  }

  return (
    <SafeAreaView className="flex-1 bg-ink-50 dark:bg-ink-950" edges={['top', 'bottom']}>
      <View className="flex-1 px-6 pt-10">
        <View className="mb-2">
          <View className="w-14 h-14 rounded-2xl bg-brand-600 items-center justify-center">
            <MaterialIcons name="school" size={28} color="#fff" />
          </View>
        </View>
        <Text className="mt-6 text-3xl font-bold text-ink-900 dark:text-ink-50">
          Welcome to{'\n'}College ERP
        </Text>
        <Text className="mt-2 text-base text-ink-500 dark:text-ink-400">
          Choose your portal to continue
        </Text>

        <View className="mt-8 gap-3">
          {OPTIONS.map((o) => (
            <Pressable
              key={o.key}
              onPress={() => select(o.key)}
              style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.98 : 1 }] }]}
              className="rounded-3xl bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 p-4 flex-row items-center"
            >
              <View
                style={{ backgroundColor: PORTAL_COLORS[o.key] + '1A' }}
                className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
              >
                <MaterialIcons name={o.icon} size={28} color={PORTAL_COLORS[o.key]} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semi text-ink-900 dark:text-ink-50">
                  {PORTAL_LABELS[o.key]}
                </Text>
                <Text className="text-sm text-ink-500 dark:text-ink-400 mt-0.5">
                  {o.description}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={palette.ink[400]} />
            </Pressable>
          ))}
        </View>

        <View className="flex-1 justify-end pb-6">
          <Text className="text-center text-xs text-ink-400">v1.0.0 · College ERP Mobile</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}
