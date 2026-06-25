import { FlatList, RefreshControl, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { useApiQuery } from '@/hooks/useApiQuery'
import { palette, PORTAL_COLORS } from '@/theme/tokens'
import { Course } from '@/types'

export default function FacultyClasses() {
  const router = useRouter()
  const { data, isLoading, refetch, isRefetching } = useApiQuery<Course[]>(
    ['faculty', 'classes'],
    '/courses/my'
  )

  if (isLoading) return <Spinner />

  return (
    <View className="flex-1 bg-ink-50 dark:bg-ink-950">
      <ScreenHeader title="My Classes" variant="large" subtitle={`${data?.length ?? 0} courses`} />
      <FlatList
        data={data ?? []}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 80, gap: 10 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={palette.brand[500]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="book"
            title="No classes assigned"
            message="Your assigned courses will appear here."
          />
        }
        renderItem={({ item }) => (
          <Card pressable onPress={() => router.push(`/(faculty)/classes/${item.id}` as any)}>
            <View className="flex-row items-center">
              <View
                style={{ backgroundColor: PORTAL_COLORS.FACULTY + '1A' }}
                className="w-12 h-12 rounded-xl items-center justify-center mr-3"
              >
                <MaterialIcons name="book" size={22} color={PORTAL_COLORS.FACULTY} />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-ink-500 dark:text-ink-400">{item.code}</Text>
                <Text className="text-base font-semi text-ink-900 dark:text-ink-50">{item.name}</Text>
                <View className="flex-row gap-2 mt-1.5">
                  {item.credits != null && <Badge label={`${item.credits} cr`} tone="brand" />}
                  {item.semester != null && <Badge label={`Sem ${item.semester}`} tone="neutral" />}
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={22} color={palette.ink[400]} />
            </View>
          </Card>
        )}
      />
    </View>
  )
}
