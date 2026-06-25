import { ScrollView, Text, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { useApiQuery } from '@/hooks/useApiQuery'
import { palette } from '@/theme/tokens'
import { Course } from '@/types'

type Material = { id: string; title: string; type: string; createdAt: string }
type Assignment = { id: string; title: string; dueDate: string; status?: string }

export default function CourseDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const courseQ = useApiQuery<Course>(['course', id], `/courses/${id}`)
  const matsQ   = useApiQuery<Material[]>(['materials', id], `/courses/${id}/materials`)
  const asgsQ   = useApiQuery<Assignment[]>(['assignments', id], `/courses/${id}/assignments`)

  if (courseQ.isLoading) return <Spinner />
  const c = courseQ.data

  return (
    <View className="flex-1 bg-ink-50 dark:bg-ink-950">
      <ScreenHeader title={c?.code ?? 'Course'} back />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <Card>
          <Text className="text-xs text-ink-500 dark:text-ink-400 font-medium">{c?.code}</Text>
          <Text className="text-xl font-bold text-ink-900 dark:text-ink-50 mt-1">{c?.name}</Text>
          {c?.description && (
            <Text className="text-sm text-ink-600 dark:text-ink-300 mt-2">{c.description}</Text>
          )}
          <View className="flex-row gap-2 mt-3">
            {c?.credits != null && <Badge label={`${c.credits} credits`} tone="brand" />}
            {c?.semester != null && <Badge label={`Sem ${c.semester}`} tone="neutral" />}
          </View>
        </Card>

        <Text className="mt-6 mb-2 text-xs font-semi text-ink-500 uppercase tracking-wider">Materials</Text>
        <View className="gap-2">
          {(matsQ.data ?? []).map((m) => (
            <Card key={m.id}>
              <View className="flex-row items-center">
                <MaterialIcons name="article" size={22} color={palette.brand[600]} />
                <View className="ml-3 flex-1">
                  <Text className="text-sm font-semi text-ink-900 dark:text-ink-50">{m.title}</Text>
                  <Text className="text-xs text-ink-500 dark:text-ink-400">{m.type}</Text>
                </View>
              </View>
            </Card>
          ))}
          {(matsQ.data?.length ?? 0) === 0 && !matsQ.isLoading && (
            <Text className="text-xs text-ink-500 text-center py-4">No materials uploaded</Text>
          )}
        </View>

        <Text className="mt-6 mb-2 text-xs font-semi text-ink-500 uppercase tracking-wider">Assignments</Text>
        <View className="gap-2">
          {(asgsQ.data ?? []).map((a) => (
            <Card key={a.id}>
              <View className="flex-row items-center">
                <MaterialIcons name="assignment" size={22} color={palette.semantic.warning} />
                <View className="ml-3 flex-1">
                  <Text className="text-sm font-semi text-ink-900 dark:text-ink-50">{a.title}</Text>
                  <Text className="text-xs text-ink-500 dark:text-ink-400">Due {a.dueDate}</Text>
                </View>
                {a.status && <Badge label={a.status} tone={a.status === 'SUBMITTED' ? 'success' : 'warning'} />}
              </View>
            </Card>
          ))}
          {(asgsQ.data?.length ?? 0) === 0 && !asgsQ.isLoading && (
            <Text className="text-xs text-ink-500 text-center py-4">No assignments yet</Text>
          )}
        </View>
      </ScrollView>
    </View>
  )
}
