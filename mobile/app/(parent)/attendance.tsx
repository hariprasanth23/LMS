import { ScrollView, Text, View } from 'react-native'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { useApiQuery } from '@/hooks/useApiQuery'
import { palette } from '@/theme/tokens'

type Summary = {
  totalClasses: number
  attended: number
  percentage: number
  byCourse: Array<{ courseCode: string; courseName: string; total: number; attended: number }>
}

export default function ParentAttendance() {
  const { data, isLoading } = useApiQuery<Summary>(['parent', 'attendance'], '/parent/ward/attendance')
  if (isLoading) return <Spinner />

  const s = data
  const pct = s?.percentage ?? 0
  const tone = pct >= 85 ? '#22C55E' : pct >= 75 ? '#F59E0B' : '#EF4444'

  return (
    <View className="flex-1 bg-ink-50 dark:bg-ink-950">
      <ScreenHeader title="Ward Attendance" variant="large" />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80 }}>
        <Card>
          <View className="items-center py-3">
            <Text style={{ color: tone }} className="text-5xl font-bold">{pct.toFixed(0)}%</Text>
            <Text className="text-sm text-ink-500 dark:text-ink-400 mt-1">
              {s?.attended ?? 0} / {s?.totalClasses ?? 0} classes
            </Text>
          </View>
        </Card>

        <Text className="mt-6 mb-2 text-xs font-semi text-ink-500 uppercase tracking-wider">By course</Text>
        <View className="gap-2">
          {(s?.byCourse ?? []).map((c) => {
            const p = c.total > 0 ? (c.attended / c.total) * 100 : 0
            const t = p >= 85 ? '#22C55E' : p >= 75 ? '#F59E0B' : '#EF4444'
            return (
              <Card key={c.courseCode}>
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-1">
                    <Text className="text-xs text-ink-500 dark:text-ink-400">{c.courseCode}</Text>
                    <Text className="text-sm font-semi text-ink-900 dark:text-ink-50" numberOfLines={1}>{c.courseName}</Text>
                  </View>
                  <Text style={{ color: t }} className="text-base font-bold">{p.toFixed(0)}%</Text>
                </View>
                <View style={{ backgroundColor: palette.ink[100], height: 6, borderRadius: 3, overflow: 'hidden' }}>
                  <View style={{ backgroundColor: t, height: '100%', width: `${p}%` }} />
                </View>
                <Text className="text-[11px] text-ink-500 mt-1.5">{c.attended} / {c.total}</Text>
              </Card>
            )
          })}
          {(s?.byCourse?.length ?? 0) === 0 && (
            <EmptyState icon="event-busy" title="No data yet" message="No attendance recorded for your ward." />
          )}
        </View>
      </ScrollView>
    </View>
  )
}
