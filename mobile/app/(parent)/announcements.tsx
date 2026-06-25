import { ScrollView, Text, View } from 'react-native'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { useApiQuery } from '@/hooks/useApiQuery'
import { Announcement } from '@/types'
import { format, parseISO } from 'date-fns'

export default function ParentAnnouncements() {
  const { data, isLoading } = useApiQuery<Announcement[]>(['announcements'], '/announcements')
  if (isLoading) return <Spinner />
  const items = data ?? []

  return (
    <View className="flex-1 bg-ink-50 dark:bg-ink-950">
      <ScreenHeader title="Announcements" back />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80, gap: 10 }}>
        {items.length === 0 ? (
          <EmptyState icon="campaign" title="No announcements" message="The college hasn't posted anything yet." />
        ) : (
          items.map((a) => (
            <Card key={a.id}>
              <View className="flex-row items-start justify-between">
                <Text className="text-sm font-semi text-ink-900 dark:text-ink-50 flex-1" numberOfLines={1}>{a.title}</Text>
                {a.audience && <Badge label={a.audience} tone="brand" />}
              </View>
              <Text className="text-sm text-ink-600 dark:text-ink-300 mt-2" numberOfLines={4}>{a.body}</Text>
              <Text className="text-[11px] text-ink-400 mt-3">{format(parseISO(a.createdAt), 'd MMM yyyy · HH:mm')}</Text>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  )
}
