import { useState } from 'react'
import { FlatList, RefreshControl, View, Text, Pressable, TextInput } from 'react-native'
import { useRouter } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { useApiQuery } from '@/hooks/useApiQuery'
import { palette } from '@/theme/tokens'
import { Course } from '@/types'

export default function CoursesList() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const { data, isLoading, refetch, isRefetching } = useApiQuery<Course[]>(['courses'], '/courses')

  const filtered = (data ?? []).filter(
    (c) =>
      !search ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <View className="flex-1 bg-ink-50 dark:bg-ink-950">
      <ScreenHeader title="Courses" subtitle={`${filtered.length} enrolled`} variant="large" />

      <View className="px-5 mb-3">
        <View className="flex-row items-center bg-white dark:bg-ink-900 rounded-2xl px-3 h-11 border border-ink-100 dark:border-ink-800">
          <MaterialIcons name="search" size={20} color={palette.ink[400]} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search courses…"
            placeholderTextColor={palette.ink[400]}
            className="flex-1 ml-2 text-base text-ink-900 dark:text-ink-50"
          />
          {search.length > 0 && (
            <Pressable hitSlop={8} onPress={() => setSearch('')}>
              <MaterialIcons name="close" size={20} color={palette.ink[400]} />
            </Pressable>
          )}
        </View>
      </View>

      {isLoading ? (
        <Spinner />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(c) => c.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 80, gap: 10 }}
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
              title="No courses yet"
              message={search ? `No matches for "${search}"` : 'Your enrolled courses will appear here.'}
            />
          }
          renderItem={({ item }) => <CourseRow course={item} onPress={() => router.push(`/(student)/courses/${item.id}` as any)} />}
        />
      )}
    </View>
  )
}

function CourseRow({ course, onPress }: { course: Course; onPress: () => void }) {
  return (
    <Card pressable onPress={onPress}>
      <View className="flex-row items-start">
        <View
          style={{ backgroundColor: palette.brand[50] }}
          className="w-12 h-12 rounded-xl items-center justify-center mr-3"
        >
          <MaterialIcons name="book" size={22} color={palette.brand[600]} />
        </View>
        <View className="flex-1">
          <Text className="text-xs text-ink-500 dark:text-ink-400 font-medium">{course.code}</Text>
          <Text className="text-base font-semi text-ink-900 dark:text-ink-50" numberOfLines={1}>
            {course.name}
          </Text>
          {course.description && (
            <Text className="text-xs text-ink-500 dark:text-ink-400 mt-1" numberOfLines={2}>
              {course.description}
            </Text>
          )}
          <View className="flex-row gap-2 mt-2">
            {course.credits != null && <Badge label={`${course.credits} credits`} tone="brand" />}
            {course.semester != null && <Badge label={`Sem ${course.semester}`} tone="neutral" />}
            <Badge label={course.status} tone={course.status === 'ACTIVE' ? 'success' : 'neutral'} />
          </View>
        </View>
        <MaterialIcons name="chevron-right" size={22} color={palette.ink[400]} />
      </View>
    </Card>
  )
}
