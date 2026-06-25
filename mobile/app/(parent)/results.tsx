import { ScrollView, Text, View } from 'react-native'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { useApiQuery } from '@/hooks/useApiQuery'
import { palette } from '@/theme/tokens'

type Grade = {
  semester: number
  cgpa?: number
  sgpa?: number
  courses: Array<{ code: string; name: string; credits: number; grade: string; marks?: number }>
}

const GRADE_TONES: Record<string, string> = {
  O: '#16A34A', 'A+': '#22C55E', A: '#65A30D', 'B+': '#0EA5E9', B: '#0284C7', C: '#F59E0B', D: '#F97316', F: '#EF4444',
}

export default function ParentResults() {
  const { data, isLoading } = useApiQuery<Grade[]>(['parent', 'results'], '/parent/ward/results')
  if (isLoading) return <Spinner />
  const grades = data ?? []
  const latest = grades[0]

  return (
    <View className="flex-1 bg-ink-50 dark:bg-ink-950">
      <ScreenHeader title="Ward Results" variant="large" />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80 }}>
        {latest ? (
          <View style={{ backgroundColor: palette.brand[700], borderRadius: 24, padding: 20 }}>
            <Text className="text-white/80 text-xs uppercase tracking-wider">Latest CGPA</Text>
            <Text className="text-white text-5xl font-bold mt-1">
              {(latest.cgpa ?? latest.sgpa ?? 0).toFixed(2)}
            </Text>
            <Text className="text-white/80 text-sm mt-1">Semester {latest.semester}</Text>
          </View>
        ) : (
          <EmptyState icon="grade" title="No results yet" message="Your ward's results will appear here." />
        )}

        {grades.map((g) => (
          <View key={g.semester} className="mt-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-base font-semi text-ink-900 dark:text-ink-50">Semester {g.semester}</Text>
              <Text className="text-sm font-bold text-brand-600 dark:text-brand-300">
                SGPA {g.sgpa?.toFixed(2) ?? '-'}
              </Text>
            </View>
            <View className="gap-2">
              {g.courses.map((c) => (
                <Card key={c.code}>
                  <View className="flex-row items-center">
                    <View className="flex-1">
                      <Text className="text-xs text-ink-500 dark:text-ink-400">{c.code}</Text>
                      <Text className="text-sm font-semi text-ink-900 dark:text-ink-50" numberOfLines={1}>{c.name}</Text>
                      <View className="flex-row gap-2 mt-1.5">
                        <Badge label={`${c.credits} credits`} tone="neutral" />
                        {c.marks != null && <Badge label={`${c.marks}/100`} tone="brand" />}
                      </View>
                    </View>
                    <View style={{
                      width: 44, height: 44, borderRadius: 22,
                      backgroundColor: (GRADE_TONES[c.grade] ?? palette.brand[500]) + '1A',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Text style={{ color: GRADE_TONES[c.grade] ?? palette.brand[500] }} className="text-base font-bold">{c.grade}</Text>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}
