import { ScrollView, Text, View } from 'react-native'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { useApiQuery } from '@/hooks/useApiQuery'
import { palette } from '@/theme/tokens'
import { format, parseISO } from 'date-fns'

type Summary = {
  totalClasses: number
  attended: number
  percentage: number
  byCourse: Array<{ courseCode: string; courseName: string; total: number; attended: number }>
}

type Recent = { date: string; courseCode: string; status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' }

export default function StudentAttendance() {
  const summaryQ = useApiQuery<Summary>(['attendance', 'summary'], '/attendance/student/me/summary')
  const recentQ  = useApiQuery<Recent[]>(['attendance', 'recent'], '/attendance/student/me')

  if (summaryQ.isLoading) return <Spinner />

  const s = summaryQ.data
  const pct = s?.percentage ?? 0
  const pctTone = pct >= 85 ? '#22C55E' : pct >= 75 ? '#F59E0B' : '#EF4444'

  return (
    <View className="flex-1 bg-ink-50 dark:bg-ink-950">
      <ScreenHeader title="Attendance" variant="large" />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80 }}>
        {/* Donut-ish header */}
        <Card>
          <View className="items-center py-4">
            <View
              style={{
                width: 140,
                height: 140,
                borderRadius: 70,
                borderWidth: 10,
                borderColor: pctTone + '33',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  width: 130,
                  height: 130,
                  borderRadius: 65,
                  borderWidth: 6,
                  borderTopColor: pctTone,
                  borderRightColor: pctTone,
                  borderBottomColor: 'transparent',
                  borderLeftColor: 'transparent',
                  transform: [{ rotate: `${(pct / 100) * 360}deg` }],
                }}
              />
              <Text style={{ color: pctTone }} className="text-3xl font-bold">
                {pct.toFixed(0)}%
              </Text>
              <Text className="text-xs text-ink-500 dark:text-ink-400">overall</Text>
            </View>
            <Text className="mt-4 text-sm text-ink-600 dark:text-ink-300">
              {s?.attended ?? 0} / {s?.totalClasses ?? 0} classes attended
            </Text>
          </View>
        </Card>

        <Text className="mt-6 mb-2 text-xs font-semi text-ink-500 uppercase tracking-wider">
          By course
        </Text>
        <View className="gap-2">
          {(s?.byCourse ?? []).map((c) => {
            const p = c.total > 0 ? (c.attended / c.total) * 100 : 0
            const tone = p >= 85 ? '#22C55E' : p >= 75 ? '#F59E0B' : '#EF4444'
            return (
              <Card key={c.courseCode}>
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-1">
                    <Text className="text-xs text-ink-500 dark:text-ink-400">{c.courseCode}</Text>
                    <Text className="text-sm font-semi text-ink-900 dark:text-ink-50" numberOfLines={1}>
                      {c.courseName}
                    </Text>
                  </View>
                  <Text style={{ color: tone }} className="text-base font-bold">
                    {p.toFixed(0)}%
                  </Text>
                </View>
                <View
                  style={{ backgroundColor: palette.ink[100], height: 6, borderRadius: 3, overflow: 'hidden' }}
                >
                  <View style={{ backgroundColor: tone, height: '100%', width: `${p}%` }} />
                </View>
                <Text className="text-[11px] text-ink-500 dark:text-ink-400 mt-1.5">
                  {c.attended} / {c.total} classes
                </Text>
              </Card>
            )
          })}
          {(s?.byCourse?.length ?? 0) === 0 && (
            <EmptyState icon="event-busy" title="No data yet" message="Once classes start being recorded you'll see them here." />
          )}
        </View>

        <Text className="mt-6 mb-2 text-xs font-semi text-ink-500 uppercase tracking-wider">
          Recent
        </Text>
        <View className="gap-2">
          {(recentQ.data ?? []).slice(0, 10).map((r, i) => (
            <Card key={i}>
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-sm font-semi text-ink-900 dark:text-ink-50">
                    {r.courseCode}
                  </Text>
                  <Text className="text-xs text-ink-500 dark:text-ink-400">
                    {format(parseISO(r.date), 'EEE, d MMM')}
                  </Text>
                </View>
                <StatusPill status={r.status} />
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

function StatusPill({ status }: { status: Recent['status'] }) {
  const map: Record<Recent['status'], { bg: string; fg: string }> = {
    PRESENT:  { bg: '#DCFCE7', fg: '#16A34A' },
    ABSENT:   { bg: '#FEE2E2', fg: '#DC2626' },
    LATE:     { bg: '#FEF3C7', fg: '#D97706' },
    EXCUSED:  { bg: '#E0E7FF', fg: '#4338CA' },
  }
  const c = map[status]
  return (
    <View style={{ backgroundColor: c.bg }} className="px-2.5 py-1 rounded-full">
      <Text style={{ color: c.fg }} className="text-xs font-semi">
        {status}
      </Text>
    </View>
  )
}
