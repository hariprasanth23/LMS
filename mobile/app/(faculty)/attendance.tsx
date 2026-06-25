import { useMemo, useState } from 'react'
import { FlatList, Pressable, Text, View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import Toast from 'react-native-toast-message'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { useApiQuery } from '@/hooks/useApiQuery'
import { apiPost } from '@/lib/api'
import { palette, PORTAL_COLORS } from '@/theme/tokens'
import { Course } from '@/types'
import { format } from 'date-fns'

type StudentRow = { id: string; name: string; rollNumber: string }
type Status = 'PRESENT' | 'ABSENT' | 'LATE'

export default function MarkAttendance() {
  const coursesQ = useApiQuery<Course[]>(['faculty', 'courses'], '/courses/my')
  const [courseId, setCourseId] = useState<string | null>(null)
  const studentsQ = useApiQuery<StudentRow[]>(
    ['students', courseId ?? 'none'],
    courseId ? `/courses/${courseId}/students` : '/students',
    { enabled: !!courseId }
  )
  const [marks, setMarks] = useState<Record<string, Status>>({})
  const [submitting, setSubmitting] = useState(false)

  const summary = useMemo(() => {
    const v = Object.values(marks)
    return {
      present: v.filter((s) => s === 'PRESENT').length,
      absent:  v.filter((s) => s === 'ABSENT').length,
      late:    v.filter((s) => s === 'LATE').length,
    }
  }, [marks])

  const submit = async () => {
    if (!courseId) return
    setSubmitting(true)
    try {
      const entries = Object.entries(marks).map(([studentId, status]) => ({ studentId, status }))
      await apiPost(`/attendance/student/mark`, { courseId, date: format(new Date(), 'yyyy-MM-dd'), entries })
      Toast.show({ type: 'success', text1: 'Attendance saved' })
      setMarks({})
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Could not save', text2: e?.message })
    } finally {
      setSubmitting(false)
    }
  }

  if (coursesQ.isLoading) return <Spinner />

  if (!courseId) {
    return (
      <View className="flex-1 bg-ink-50 dark:bg-ink-950">
        <ScreenHeader title="Mark Attendance" variant="large" subtitle="Pick a class" />
        <FlatList
          data={coursesQ.data ?? []}
          keyExtractor={(c) => c.id}
          contentContainerStyle={{ padding: 20, gap: 10 }}
          ListEmptyComponent={
            <EmptyState icon="book" title="No classes" message="No courses assigned to you." />
          }
          renderItem={({ item }) => (
            <Card pressable onPress={() => setCourseId(item.id)}>
              <View className="flex-row items-center">
                <View
                  style={{ backgroundColor: PORTAL_COLORS.FACULTY + '1A' }}
                  className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                >
                  <MaterialIcons name="book" size={22} color={PORTAL_COLORS.FACULTY} />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-ink-500 dark:text-ink-400">{item.code}</Text>
                  <Text className="text-sm font-semi text-ink-900 dark:text-ink-50">{item.name}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={22} color={palette.ink[400]} />
              </View>
            </Card>
          )}
        />
      </View>
    )
  }

  return (
    <View className="flex-1 bg-ink-50 dark:bg-ink-950">
      <ScreenHeader
        title="Mark Attendance"
        back
        right={
          <Pressable onPress={() => setCourseId(null)} hitSlop={8}>
            <Text className="text-sm text-brand-600">Change</Text>
          </Pressable>
        }
      />

      <View className="px-5 mb-2 flex-row gap-2">
        <SummaryPill label="Present" count={summary.present} tone="#22C55E" />
        <SummaryPill label="Absent" count={summary.absent} tone="#EF4444" />
        <SummaryPill label="Late" count={summary.late} tone="#F59E0B" />
      </View>

      {studentsQ.isLoading ? (
        <Spinner />
      ) : (
        <FlatList
          data={studentsQ.data ?? []}
          keyExtractor={(s) => s.id}
          contentContainerStyle={{ padding: 20, paddingBottom: 100, gap: 8 }}
          ListEmptyComponent={
            <EmptyState icon="people" title="No students" message="No students enrolled in this course." />
          }
          renderItem={({ item }) => (
            <StudentMarkRow
              student={item}
              status={marks[item.id]}
              onChange={(s) => setMarks((m) => ({ ...m, [item.id]: s }))}
            />
          )}
        />
      )}

      <View className="absolute bottom-0 left-0 right-0 p-4 bg-ink-50 dark:bg-ink-950 border-t border-ink-100 dark:border-ink-800">
        <Button
          label={`Save (${Object.keys(marks).length} marked)`}
          size="lg"
          fullWidth
          loading={submitting}
          disabled={Object.keys(marks).length === 0}
          onPress={submit}
        />
      </View>
    </View>
  )
}

function SummaryPill({ label, count, tone }: { label: string; count: number; tone: string }) {
  return (
    <View
      style={{ backgroundColor: tone + '14', borderColor: tone + '33' }}
      className="flex-1 rounded-2xl border px-3 py-2"
    >
      <Text style={{ color: tone }} className="text-base font-bold">
        {count}
      </Text>
      <Text className="text-[11px] text-ink-500">{label}</Text>
    </View>
  )
}

function StudentMarkRow({
  student,
  status,
  onChange,
}: {
  student: StudentRow
  status: Status | undefined
  onChange: (s: Status) => void
}) {
  return (
    <Card>
      <View className="flex-row items-center">
        <Avatar name={student.name} size={36} tone={PORTAL_COLORS.FACULTY} />
        <View className="ml-3 flex-1">
          <Text className="text-sm font-semi text-ink-900 dark:text-ink-50" numberOfLines={1}>
            {student.name}
          </Text>
          <Text className="text-[11px] text-ink-500 dark:text-ink-400">{student.rollNumber}</Text>
        </View>
        <View className="flex-row gap-1.5">
          <StatusChip label="P" tone="#22C55E" active={status === 'PRESENT'} onPress={() => onChange('PRESENT')} />
          <StatusChip label="A" tone="#EF4444" active={status === 'ABSENT'} onPress={() => onChange('ABSENT')} />
          <StatusChip label="L" tone="#F59E0B" active={status === 'LATE'} onPress={() => onChange('LATE')} />
        </View>
      </View>
    </Card>
  )
}

function StatusChip({
  label,
  tone,
  active,
  onPress,
}: {
  label: string
  tone: string
  active: boolean
  onPress: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: active ? tone : tone + '14',
        borderWidth: 1,
        borderColor: active ? tone : tone + '33',
        width: 36,
        height: 36,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: active ? '#FFFFFF' : tone, fontWeight: '700' }}>{label}</Text>
    </Pressable>
  )
}
