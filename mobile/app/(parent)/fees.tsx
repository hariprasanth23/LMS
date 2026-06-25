import { ScrollView, Text, View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { useApiQuery } from '@/hooks/useApiQuery'
import { palette } from '@/theme/tokens'
import { format, parseISO } from 'date-fns'

type FeeRecord = {
  id: string
  feeType: string
  amount: number
  paidAmount: number
  dueDate: string
  status: 'PAID' | 'PARTIAL' | 'PENDING' | 'OVERDUE'
}

export default function ParentFees() {
  const { data, isLoading } = useApiQuery<FeeRecord[]>(['parent', 'fees'], '/parent/ward/fees')
  if (isLoading) return <Spinner />
  const fees = data ?? []
  const due = fees.filter((f) => f.status !== 'PAID').reduce((s, f) => s + (f.amount - f.paidAmount), 0)

  return (
    <View className="flex-1 bg-ink-50 dark:bg-ink-950">
      <ScreenHeader title="Ward Fees" variant="large" />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80 }}>
        <View style={{ backgroundColor: palette.brand[600], borderRadius: 24, padding: 20 }}>
          <Text className="text-white/80 text-xs font-semi uppercase tracking-wider">Total due</Text>
          <Text className="text-white text-4xl font-bold mt-1">₹{due.toLocaleString('en-IN')}</Text>
          <View className="mt-5">
            <Button
              label="Pay now"
              variant="secondary"
              size="md"
              fullWidth
              leftIcon={<MaterialIcons name="payments" size={18} color={palette.brand[700]} />}
            />
          </View>
        </View>

        <Text className="mt-6 mb-2 text-xs font-semi text-ink-500 uppercase tracking-wider">Bills</Text>
        {fees.length === 0 ? (
          <EmptyState icon="payments" title="No bills" message="Fee bills will appear here." />
        ) : (
          <View className="gap-2">
            {fees.map((f) => (
              <Card key={f.id}>
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-sm font-semi text-ink-900 dark:text-ink-50">{f.feeType}</Text>
                    <Text className="text-xs text-ink-500 dark:text-ink-400 mt-1">Due {format(parseISO(f.dueDate), 'd MMM yyyy')}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-base font-bold text-ink-900 dark:text-ink-50">₹{f.amount.toLocaleString('en-IN')}</Text>
                    <Badge label={f.status} tone={f.status === 'PAID' ? 'success' : f.status === 'OVERDUE' ? 'danger' : 'warning'} />
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  )
}
