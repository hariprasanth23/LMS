import { ScrollView, Text, View, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { useAuth } from '@/context/AuthContext'
import { useApiQuery } from '@/hooks/useApiQuery'
import { palette, PORTAL_COLORS } from '@/theme/tokens'
import { format } from 'date-fns'
import { Course } from '@/types'

export default function FacultyHome() {
  const { user } = useAuth()
  const router = useRouter()
  const coursesQ = useApiQuery<Course[]>(['faculty', 'courses'], '/courses/my')

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-ink-50 dark:bg-ink-950">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Hero */}
        <View className="px-5 pt-2 flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-sm text-ink-500 dark:text-ink-400">Hello,</Text>
            <Text className="text-2xl font-bold text-ink-900 dark:text-ink-50" numberOfLines={1}>
              {user?.name ?? 'Faculty'}
            </Text>
            <Text className="text-xs text-ink-500 dark:text-ink-400 mt-1">
              {format(new Date(), 'EEEE, d MMMM yyyy')}
            </Text>
          </View>
          <Avatar name={user?.name} size={48} tone={PORTAL_COLORS.FACULTY} />
        </View>

        {/* Day stat */}
        <View className="mt-5 px-5">
          <View
            style={{ backgroundColor: PORTAL_COLORS.FACULTY, borderRadius: 24 }}
            className="p-5 flex-row items-center"
          >
            <View className="flex-1">
              <Text className="text-white/80 text-xs uppercase tracking-wider">Today</Text>
              <Text className="text-white text-3xl font-bold mt-1">4 classes</Text>
              <Text className="text-white/80 text-xs mt-1">Next: CS601 · 11:00 AM · Room A-203</Text>
            </View>
            <View className="bg-white/15 w-14 h-14 rounded-2xl items-center justify-center">
              <MaterialIcons name="schedule" size={28} color="#FFFFFF" />
            </View>
          </View>
        </View>

        {/* Quick actions */}
        <View className="mt-6 px-5">
          <Text className="text-xs font-semi text-ink-500 uppercase tracking-wider mb-3">
            Quick actions
          </Text>
          <View className="flex-row gap-3">
            <QuickAction
              icon="event-available"
              label="Mark Attendance"
              tone="#22C55E"
              onPress={() => router.push('/(faculty)/attendance')}
            />
            <QuickAction
              icon="campaign"
              label="Post"
              tone="#0EA5E9"
              onPress={() => router.push('/(faculty)/announcements')}
            />
            <QuickAction
              icon="beach-access"
              label="Apply Leave"
              tone="#F59E0B"
              onPress={() => router.push('/(faculty)/leaves')}
            />
          </View>
        </View>

        {/* My classes */}
        <View className="mt-6 px-5">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-semi text-ink-900 dark:text-ink-50">My Classes</Text>
            <Pressable hitSlop={8} onPress={() => router.push('/(faculty)/classes')}>
              <Text className="text-sm text-brand-600 dark:text-brand-300 font-medium">See all</Text>
            </Pressable>
          </View>
          <View className="gap-2 mt-3">
            {(coursesQ.data?.slice(0, 4) ?? []).map((c) => (
              <Card
                key={c.id}
                pressable
                onPress={() => router.push(`/(faculty)/classes/${c.id}` as any)}
              >
                <View className="flex-row items-center">
                  <View
                    style={{ backgroundColor: PORTAL_COLORS.FACULTY + '1A' }}
                    className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                  >
                    <MaterialIcons name="book" size={22} color={PORTAL_COLORS.FACULTY} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs text-ink-500 dark:text-ink-400">{c.code}</Text>
                    <Text className="text-sm font-semi text-ink-900 dark:text-ink-50">{c.name}</Text>
                  </View>
                  <Badge label={`${c.credits ?? '-'} cr`} tone="brand" />
                </View>
              </Card>
            ))}
            {(coursesQ.data?.length ?? 0) === 0 && (
              <Text className="text-sm text-ink-500 text-center py-6">
                No classes assigned this term
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function QuickAction({
  icon,
  label,
  tone,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap
  label: string
  tone: string
  onPress: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.97 : 1 }] }]}
      className="flex-1 bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-4 items-center"
    >
      <View style={{ backgroundColor: tone + '1A' }} className="w-12 h-12 rounded-xl items-center justify-center mb-2">
        <MaterialIcons name={icon} size={22} color={tone} />
      </View>
      <Text className="text-xs font-semi text-ink-900 dark:text-ink-50 text-center">{label}</Text>
    </Pressable>
  )
}
