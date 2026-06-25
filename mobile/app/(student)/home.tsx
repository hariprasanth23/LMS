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
import { Announcement, Course } from '@/types'

function greeting(hour: number) {
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

const QUICK_LINKS: Array<{ icon: keyof typeof MaterialIcons.glyphMap; label: string; href: any; tone: string }> = [
  { icon: 'event-available',  label: 'Attendance', href: '/(student)/attendance', tone: '#22C55E' },
  { icon: 'schedule',         label: 'Timetable',  href: '/(student)/timetable',  tone: '#F59E0B' },
  { icon: 'payments',         label: 'Fees',       href: '/(student)/fees',       tone: '#0EA5E9' },
  { icon: 'grade',            label: 'Results',    href: '/(student)/results',    tone: '#8B5CF6' },
]

export default function StudentHome() {
  const { user } = useAuth()
  const router = useRouter()
  const now = new Date()

  const coursesQ = useApiQuery<Course[]>(['student', 'courses'], '/courses')
  const annsQ    = useApiQuery<Announcement[]>(['announcements'], '/announcements')

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-ink-50 dark:bg-ink-950">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
        {/* ── Hero header ── */}
        <View className="px-5 pt-2">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-sm text-ink-500 dark:text-ink-400">
                {greeting(now.getHours())},
              </Text>
              <Text className="text-2xl font-bold text-ink-900 dark:text-ink-50" numberOfLines={1}>
                {user?.name ?? 'Student'} 👋
              </Text>
              <Text className="text-xs text-ink-500 dark:text-ink-400 mt-1">
                {format(now, 'EEEE, d MMMM yyyy')}
              </Text>
            </View>
            <Pressable onPress={() => router.push('/(student)/profile')}>
              <Avatar name={user?.name} size={48} tone={PORTAL_COLORS.STUDENT} />
            </Pressable>
          </View>

          {/* ── Stat strip ── */}
          <View className="mt-5 flex-row gap-3">
            <StatBubble label="Today's Classes" value="3" tone="#3B82F6" />
            <StatBubble label="Attendance" value="92%" tone="#22C55E" />
            <StatBubble label="Pending" value="2" tone="#F59E0B" />
          </View>
        </View>

        {/* ── Quick links ── */}
        <View className="mt-6 px-5">
          <Text className="text-xs font-semi text-ink-500 dark:text-ink-400 mb-3 uppercase tracking-wider">
            Quick links
          </Text>
          <View className="flex-row flex-wrap -mx-1">
            {QUICK_LINKS.map((q) => (
              <View key={q.label} className="w-1/2 px-1 mb-2">
                <Pressable
                  onPress={() => router.push(q.href)}
                  style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.97 : 1 }] }]}
                  className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-4"
                >
                  <View
                    style={{ backgroundColor: q.tone + '1A' }}
                    className="w-10 h-10 rounded-xl items-center justify-center mb-3"
                  >
                    <MaterialIcons name={q.icon} size={22} color={q.tone} />
                  </View>
                  <Text className="text-sm font-semi text-ink-900 dark:text-ink-50">{q.label}</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        {/* ── My Courses ── */}
        <View className="mt-6 px-5">
          <SectionHeader
            title="My Courses"
            action="See all"
            onAction={() => router.push('/(student)/courses')}
          />
          <View className="gap-2 mt-3">
            {(coursesQ.data?.slice(0, 3) ?? []).map((c) => (
              <Card key={c.id} pressable onPress={() => router.push(`/(student)/courses/${c.id}` as any)}>
                <View className="flex-row items-center">
                  <View
                    style={{ backgroundColor: palette.brand[50] }}
                    className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                  >
                    <MaterialIcons name="book" size={22} color={palette.brand[600]} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs text-ink-500 dark:text-ink-400">{c.code}</Text>
                    <Text className="text-sm font-semi text-ink-900 dark:text-ink-50" numberOfLines={1}>
                      {c.name}
                    </Text>
                  </View>
                  <Badge label={`${c.credits ?? '-'} cr`} tone="brand" />
                </View>
              </Card>
            ))}
            {(coursesQ.data?.length ?? 0) === 0 && !coursesQ.isLoading && (
              <Text className="text-sm text-ink-500 text-center py-6">No courses enrolled yet</Text>
            )}
          </View>
        </View>

        {/* ── Announcements ── */}
        <View className="mt-6 px-5">
          <SectionHeader title="Announcements" />
          <View className="gap-2 mt-3">
            {(annsQ.data?.slice(0, 3) ?? []).map((a) => (
              <Card key={a.id}>
                <Text className="text-sm font-semi text-ink-900 dark:text-ink-50">{a.title}</Text>
                <Text className="text-xs text-ink-500 dark:text-ink-400 mt-1" numberOfLines={2}>
                  {a.body}
                </Text>
                <Text className="text-[10px] text-ink-400 mt-2">
                  {format(new Date(a.createdAt), 'd MMM, HH:mm')}
                </Text>
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

function StatBubble({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <View
      style={{ backgroundColor: tone + '14', borderColor: tone + '33' }}
      className="flex-1 rounded-2xl border p-3"
    >
      <Text style={{ color: tone }} className="text-xl font-bold">
        {value}
      </Text>
      <Text className="text-[11px] text-ink-500 dark:text-ink-400 mt-0.5">{label}</Text>
    </View>
  )
}

function SectionHeader({
  title,
  action,
  onAction,
}: {
  title: string
  action?: string
  onAction?: () => void
}) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-base font-semi text-ink-900 dark:text-ink-50">{title}</Text>
      {action && (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text className="text-sm text-brand-600 dark:text-brand-300 font-medium">{action}</Text>
        </Pressable>
      )}
    </View>
  )
}
