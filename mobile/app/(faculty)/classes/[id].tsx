import { ScrollView, Text, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useApiQuery } from '@/hooks/useApiQuery'
import { palette, PORTAL_COLORS } from '@/theme/tokens'
import { Course } from '@/types'

export default function ClassDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const courseQ = useApiQuery<Course>(['faculty', 'class', id], `/courses/${id}`)

  if (courseQ.isLoading) return <Spinner />
  const c = courseQ.data

  const stats = [
    { label: 'Enrolled', value: '42', icon: 'people' as const, tone: '#0EA5E9' },
    { label: 'Avg. attendance', value: '87%', icon: 'event-available' as const, tone: '#22C55E' },
    { label: 'Pending grading', value: '6', icon: 'pending-actions' as const, tone: '#F59E0B' },
  ]

  return (
    <View className="flex-1 bg-ink-50 dark:bg-ink-950">
      <ScreenHeader title={c?.code ?? 'Class'} back />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80 }}>
        <Card>
          <Text className="text-xs text-ink-500 dark:text-ink-400">{c?.code}</Text>
          <Text className="text-xl font-bold text-ink-900 dark:text-ink-50 mt-1">{c?.name}</Text>
          {c?.description && <Text className="text-sm text-ink-600 dark:text-ink-300 mt-2">{c.description}</Text>}
        </Card>

        <View className="flex-row gap-3 mt-4">
          {stats.map((s) => (
            <View
              key={s.label}
              style={{ backgroundColor: s.tone + '14', borderColor: s.tone + '33' }}
              className="flex-1 rounded-2xl border p-3"
            >
              <MaterialIcons name={s.icon} size={20} color={s.tone} />
              <Text style={{ color: s.tone }} className="text-xl font-bold mt-1">{s.value}</Text>
              <Text className="text-[11px] text-ink-500 dark:text-ink-400 mt-0.5">{s.label}</Text>
            </View>
          ))}
        </View>

        <View className="gap-2 mt-6">
          <Button
            label="Mark attendance"
            size="lg"
            leftIcon={<MaterialIcons name="event-available" size={20} color="#fff" />}
            onPress={() => router.push('/(faculty)/attendance')}
            fullWidth
          />
          <Button
            label="Post announcement"
            variant="secondary"
            size="lg"
            leftIcon={<MaterialIcons name="campaign" size={20} color={PORTAL_COLORS.FACULTY} />}
            onPress={() => router.push('/(faculty)/announcements')}
            fullWidth
          />
        </View>
      </ScrollView>
    </View>
  )
}
