import { useState } from 'react'
import { ScrollView, Text, View, Modal, Pressable, TextInput } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { useApiQuery } from '@/hooks/useApiQuery'
import { apiPost } from '@/lib/api'
import { palette } from '@/theme/tokens'
import { LeaveBalance } from '@/types'
import { format, parseISO } from 'date-fns'

type LeaveRequest = {
  id: string
  leaveType: 'CL' | 'SL' | 'EL' | 'ML' | 'COL'
  fromDate: string
  toDate: string
  reason: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
}

const TYPE_LABEL: Record<LeaveRequest['leaveType'], string> = {
  CL: 'Casual', SL: 'Sick', EL: 'Earned', ML: 'Maternity', COL: 'Compensatory',
}

export default function Leaves() {
  const balancesQ = useApiQuery<LeaveBalance[]>(['leaves', 'balance'], '/leaves/balance')
  const reqsQ     = useApiQuery<LeaveRequest[]>(['leaves', 'my'], '/leaves/my')
  const [open, setOpen] = useState(false)

  if (balancesQ.isLoading) return <Spinner />

  return (
    <View className="flex-1 bg-ink-50 dark:bg-ink-950">
      <ScreenHeader
        title="Leaves"
        variant="large"
        right={
          <Pressable
            onPress={() => setOpen(true)}
            className="bg-brand-600 px-3 py-2 rounded-full flex-row items-center"
          >
            <MaterialIcons name="add" size={16} color="#fff" />
            <Text className="text-white text-xs font-semi ml-1">New</Text>
          </Pressable>
        }
      />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80 }}>
        <Text className="text-xs font-semi text-ink-500 uppercase tracking-wider mb-3">
          Balance
        </Text>
        <View className="flex-row flex-wrap -mx-1">
          {(balancesQ.data ?? []).map((b) => (
            <View key={b.leaveType} className="w-1/2 px-1 mb-2">
              <Card>
                <Text className="text-xs text-ink-500 dark:text-ink-400">{TYPE_LABEL[b.leaveType]}</Text>
                <Text className="text-2xl font-bold text-ink-900 dark:text-ink-50 mt-1">
                  {b.balance}
                </Text>
                <Text className="text-[11px] text-ink-500 mt-1">
                  {b.usedDays}/{b.totalDays} used
                </Text>
              </Card>
            </View>
          ))}
        </View>

        <Text className="mt-6 mb-2 text-xs font-semi text-ink-500 uppercase tracking-wider">
          Recent requests
        </Text>
        <View className="gap-2">
          {(reqsQ.data ?? []).map((r) => (
            <Card key={r.id}>
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-sm font-semi text-ink-900 dark:text-ink-50">
                    {TYPE_LABEL[r.leaveType]}
                  </Text>
                  <Text className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">
                    {format(parseISO(r.fromDate), 'd MMM')} – {format(parseISO(r.toDate), 'd MMM yyyy')}
                  </Text>
                  {r.reason && (
                    <Text className="text-xs text-ink-500 dark:text-ink-400 mt-1" numberOfLines={1}>
                      {r.reason}
                    </Text>
                  )}
                </View>
                <Badge
                  label={r.status}
                  tone={r.status === 'APPROVED' ? 'success' : r.status === 'REJECTED' ? 'danger' : 'warning'}
                />
              </View>
            </Card>
          ))}
          {(reqsQ.data?.length ?? 0) === 0 && (
            <EmptyState icon="beach-access" title="No leave requests" message="Tap New to apply." />
          )}
        </View>
      </ScrollView>

      <ApplyLeaveModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={() => { reqsQ.refetch(); setOpen(false) }}
      />
    </View>
  )
}

function ApplyLeaveModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean
  onClose: () => void
  onCreated: () => void
}) {
  const [type, setType] = useState<LeaveRequest['leaveType']>('CL')
  const [fromDate, setFrom] = useState('')
  const [toDate, setTo] = useState('')
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    if (!fromDate || !toDate) {
      Toast.show({ type: 'error', text1: 'Pick from and to dates' })
      return
    }
    setBusy(true)
    try {
      await apiPost('/leaves/apply', { leaveType: type, fromDate, toDate, reason })
      Toast.show({ type: 'success', text1: 'Leave request submitted' })
      onCreated()
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Could not submit', text2: e?.response?.data?.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal visible={open} animationType="slide" onRequestClose={onClose} presentationStyle="pageSheet">
      <SafeAreaView className="flex-1 bg-ink-50 dark:bg-ink-950">
        <View className="px-5 pt-2 flex-row items-center justify-between">
          <Pressable onPress={onClose} hitSlop={8}>
            <Text className="text-base text-brand-600">Cancel</Text>
          </Pressable>
          <Text className="text-base font-semi text-ink-900 dark:text-ink-50">New leave</Text>
          <View style={{ width: 50 }} />
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }} keyboardShouldPersistTaps="handled">
          <View>
            <Text className="text-sm font-medium text-ink-700 dark:text-ink-200 mb-2">Type</Text>
            <View className="flex-row flex-wrap gap-2">
              {(Object.keys(TYPE_LABEL) as LeaveRequest['leaveType'][]).map((k) => (
                <Pressable
                  key={k}
                  onPress={() => setType(k)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 999,
                    backgroundColor: type === k ? palette.brand[600] : '#FFFFFF',
                    borderWidth: 1,
                    borderColor: type === k ? palette.brand[600] : palette.ink[200],
                  }}
                >
                  <Text style={{ color: type === k ? '#FFFFFF' : palette.ink[700], fontWeight: '600' }}>
                    {TYPE_LABEL[k]}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Input
            label="From date"
            placeholder="YYYY-MM-DD"
            value={fromDate}
            onChangeText={setFrom}
            icon="calendar-today"
            autoCapitalize="none"
          />
          <Input
            label="To date"
            placeholder="YYYY-MM-DD"
            value={toDate}
            onChangeText={setTo}
            icon="event"
            autoCapitalize="none"
          />
          <View>
            <Text className="text-sm font-medium text-ink-700 dark:text-ink-200 mb-1.5">Reason</Text>
            <TextInput
              multiline
              numberOfLines={4}
              value={reason}
              onChangeText={setReason}
              placeholder="Optional reason"
              placeholderTextColor={palette.ink[400]}
              className="bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 rounded-2xl p-3 text-ink-900 dark:text-ink-50"
              style={{ minHeight: 100, textAlignVertical: 'top' }}
            />
          </View>

          <Button label="Submit request" size="lg" fullWidth loading={busy} onPress={submit} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}
