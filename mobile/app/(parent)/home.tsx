import { ScrollView, Text, View, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { useAuth } from '@/context/AuthContext'
import { useApiQuery } from '@/hooks/useApiQuery'
import { palette, PORTAL_COLORS } from '@/theme/tokens'
import { format, parseISO } from 'date-fns'
import { Announcement } from '@/types'

type WardSummary = {
  name: string
  rollNumber: string
  semester: number
  program: string
  attendancePercentage: number
  pendingFees: number
  lastCgpa?: number
}

export default function ParentHome() {
  const { user } = useAuth()
  const router = useRouter()
  const wardQ = useApiQuery<WardSummary>(['ward'], '/parent/ward/summary')
  const annsQ = useApiQuery<Announcement[]>(['announcements'], '/announcements')

  const w = wardQ.data

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-ink-50 dark:bg-ink-950">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View className="px-5 pt-2 flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-sm text-ink-500 dark:text-ink-400">Welcome,</Text>
            <Text className="text-2xl font-bold text-ink-900 dark:text-ink-50" numberOfLines={1}>
              {user?.name ?? 'Parent'}
            </Text>
            <Text className="text-xs text-ink-500 dark:text-ink-400 mt-1">
              {format(new Date(), 'EEEE, d MMMM yyyy')}
            </Text>
          </View>
          <Avatar name={user?.name} size={48} tone={PORTAL_COLORS.PARENT} />
        </View>

        {/* Ward identity card */}
        <View className="mt-5 px-5">
          <View style={{ backgroundColor: PORTAL_COLORS.PARENT, borderRadius: 24 }} className="p-5">
            <View className="flex-row items-center">
              <Avatar name={w?.name ?? 'W'} size={56} tone="#FFFFFF" />
              <View className="ml-4 flex-1">
                <Text className="text-white/80 text-xs uppercase tracking-wider">Your ward</Text>
                <Text className="text-white text-lg font-bold" numberOfLines={1}>
                  {w?.name ?? '—'}
                </Text>
                <Text className="text-white/80 text-xs mt-0.5">
                  {w?.rollNumber} · {w?.program} · Sem {w?.semester}
                </Text>
              </View>
            </View>

            <View className="flex-row gap-3 mt-5">
              <View className="flex-1 bg-white/15 rounded-2xl p-3">
                <Text className="text-white/70 text-[11px]">Attendance</Text>
                <Text className="text-white text-lg font-bold">
                  {(w?.attendancePercentage ?? 0).toFixed(0)}%
                </Text>
              </View>
              <View className="flex-1 bg-white/15 rounded-2xl p-3">
                <Text className="text-white/70 text-[11px]">Pending fees</Text>
                <Text className="text-white text-lg font-bold">
                  ₹{(w?.pendingFees ?? 0).toLocaleString('en-IN')}
                </Text>
              </View>
              <View className="flex-1 bg-white/15 rounded-2xl p-3">
                <Text className="text-white/70 text-[11px]">CGPA</Text>
                <Text className="text-white text-lg font-bold">
                  {w?.lastCgpa?.toFixed(2) ?? '—'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick links */}
        <View className="mt-6 px-5">
          <Text className="text-xs font-semi text-ink-500 uppercase tracking-wider mb-3">
            Quick links
          </Text>
          <View className="flex-row gap-3">
            <Tile icon="event-available" label="Attendance" tone="#22C55E" onPress={() => router.push('/(parent)/attendance')} />
            <Tile icon="grade"           label="Results"    tone="#8B5CF6" onPress={() => router.push('/(parent)/results')} />
            <Tile icon="payments"        label="Fees"       tone="#0EA5E9" onPress={() => router.push('/(parent)/fees')} />
          </View>
        </View>

        {/* Announcements */}
        <View className="mt-6 px-5">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-semi text-ink-900 dark:text-ink-50">Announcements</Text>
            <Pressable hitSlop={8} onPress={() => router.push('/(parent)/announcements')}>
              <Text className="text-sm text-brand-600 dark:text-brand-300 font-medium">See all</Text>
            </Pressable>
          </View>
          <View className="gap-2 mt-3">
            {(annsQ.data?.slice(0, 3) ?? []).map((a) => (
              <Card key={a.id}>
                <Text className="text-sm font-semi text-ink-900 dark:text-ink-50">{a.title}</Text>
                <Text className="text-xs text-ink-500 dark:text-ink-400 mt-1" numberOfLines={2}>{a.body}</Text>
                <Text className="text-[10px] text-ink-400 mt-2">{format(parseISO(a.createdAt), 'd MMM, HH:mm')}</Text>
              </Card>
            ))}
            {(annsQ.data?.length ?? 0) === 0 && !annsQ.isLoading && (
              <Text className="text-sm text-ink-500 text-center py-6">No announcements</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function Tile({
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
