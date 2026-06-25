import { useState } from 'react'
import { ScrollView, Text, View, Pressable } from 'react-native'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { useApiQuery } from '@/hooks/useApiQuery'
import { palette } from '@/theme/tokens'

type Slot = {
  id: string
  day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT'
  startTime: string
  endTime: string
  courseCode: string
  courseName: string
  room?: string
  facultyName?: string
}

const DAYS: Slot['day'][] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const DAY_LABELS: Record<Slot['day'], string> = {
  MON: 'Monday', TUE: 'Tuesday', WED: 'Wednesday', THU: 'Thursday', FRI: 'Friday', SAT: 'Saturday',
}

export default function Timetable() {
  const [day, setDay] = useState<Slot['day']>(today())
  const { data, isLoading } = useApiQuery<Slot[]>(['timetable'], '/courses/timetable/me')

  const slots = (data ?? []).filter((s) => s.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime))

  return (
    <View className="flex-1 bg-ink-50 dark:bg-ink-950">
      <ScreenHeader title="Timetable" back variant="large" />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 6 }}>
        <View className="flex-row gap-2">
          {DAYS.map((d) => {
            const active = d === day
            return (
              <Pressable
                key={d}
                onPress={() => setDay(d)}
                style={[
                  { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
                  active
                    ? { backgroundColor: palette.brand[600] }
                    : { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: palette.ink[200] },
                ]}
              >
                <Text style={{ color: active ? '#FFFFFF' : palette.ink[700], fontWeight: '600' }}>{d}</Text>
              </Pressable>
            )
          })}
        </View>
      </ScrollView>

      {isLoading ? (
        <Spinner />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80 }}>
          <Text className="text-xs font-semi text-ink-500 uppercase tracking-wider mb-3">
            {DAY_LABELS[day]}
          </Text>
          {slots.length === 0 ? (
            <EmptyState icon="event-note" title="No classes" message="Enjoy the day off." />
          ) : (
            <View className="gap-2">
              {slots.map((s) => (
                <Card key={s.id}>
                  <View className="flex-row">
                    <View className="mr-3 items-center" style={{ width: 60 }}>
                      <Text className="text-sm font-bold text-brand-600">{s.startTime}</Text>
                      <View style={{ width: 1, height: 12, backgroundColor: palette.ink[200], marginVertical: 4 }} />
                      <Text className="text-[11px] text-ink-500">{s.endTime}</Text>
                    </View>
                    <View className="flex-1 border-l border-ink-100 dark:border-ink-800 pl-3">
                      <Text className="text-xs text-ink-500 dark:text-ink-400">{s.courseCode}</Text>
                      <Text className="text-base font-semi text-ink-900 dark:text-ink-50">{s.courseName}</Text>
                      <Text className="text-xs text-ink-500 dark:text-ink-400 mt-1">
                        {s.facultyName ?? 'Faculty TBA'} {s.room ? `· Room ${s.room}` : ''}
                      </Text>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  )
}

function today(): Slot['day'] {
  const map: Record<number, Slot['day']> = { 1: 'MON', 2: 'TUE', 3: 'WED', 4: 'THU', 5: 'FRI', 6: 'SAT' }
  return map[new Date().getDay()] ?? 'MON'
}
