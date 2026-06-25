import { useState } from 'react'
import { ScrollView, Text, View, Pressable, TextInput, Modal } from 'react-native'
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
import { Announcement } from '@/types'
import { format, parseISO } from 'date-fns'

export default function Announcements() {
  const reqsQ = useApiQuery<Announcement[]>(['announcements'], '/announcements')
  const [open, setOpen] = useState(false)
  if (reqsQ.isLoading) return <Spinner />

  return (
    <View className="flex-1 bg-ink-50 dark:bg-ink-950">
      <ScreenHeader
        title="Announcements"
        back
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
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80, gap: 10 }}>
        {(reqsQ.data ?? []).length === 0 ? (
          <EmptyState icon="campaign" title="No announcements" message="Tap New to post one." />
        ) : (
          (reqsQ.data ?? []).map((a) => (
            <Card key={a.id}>
              <View className="flex-row items-start justify-between">
                <Text className="text-sm font-semi text-ink-900 dark:text-ink-50 flex-1" numberOfLines={1}>
                  {a.title}
                </Text>
                {a.audience && <Badge label={a.audience} tone="brand" />}
              </View>
              <Text className="text-sm text-ink-600 dark:text-ink-300 mt-2" numberOfLines={3}>
                {a.body}
              </Text>
              <Text className="text-[11px] text-ink-400 mt-3">
                {format(parseISO(a.createdAt), 'd MMM yyyy · HH:mm')}
              </Text>
            </Card>
          ))
        )}
      </ScrollView>

      <NewAnnouncementModal open={open} onClose={() => setOpen(false)} onCreated={() => { reqsQ.refetch(); setOpen(false) }} />
    </View>
  )
}

function NewAnnouncementModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean
  onClose: () => void
  onCreated: () => void
}) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    if (!title.trim() || !body.trim()) {
      Toast.show({ type: 'error', text1: 'Title and message are required' })
      return
    }
    setBusy(true)
    try {
      await apiPost('/announcements', { title, body })
      Toast.show({ type: 'success', text1: 'Posted' })
      setTitle('')
      setBody('')
      onCreated()
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Could not post', text2: e?.response?.data?.message })
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
          <Text className="text-base font-semi text-ink-900 dark:text-ink-50">New post</Text>
          <View style={{ width: 50 }} />
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }} keyboardShouldPersistTaps="handled">
          <Input label="Title" value={title} onChangeText={setTitle} placeholder="Class cancelled tomorrow" icon="title" />
          <View>
            <Text className="text-sm font-medium text-ink-700 dark:text-ink-200 mb-1.5">Message</Text>
            <TextInput
              multiline
              numberOfLines={6}
              value={body}
              onChangeText={setBody}
              placeholder="Write your announcement…"
              placeholderTextColor={palette.ink[400]}
              className="bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 rounded-2xl p-3 text-ink-900 dark:text-ink-50"
              style={{ minHeight: 150, textAlignVertical: 'top' }}
            />
          </View>
          <Button label="Post" size="lg" fullWidth loading={busy} onPress={submit} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}
