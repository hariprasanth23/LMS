import { ScrollView, Text, View, Pressable, Switch, useColorScheme, Alert } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { palette, PORTAL_COLORS } from '@/theme/tokens'

type Row = {
  icon: keyof typeof MaterialIcons.glyphMap
  label: string
  value?: string
  onPress?: () => void
}

export default function Profile() {
  const { user, logout } = useAuth()
  const scheme = useColorScheme()

  const personal: Row[] = [
    { icon: 'badge',           label: 'Roll number', value: 'CS21001' },
    { icon: 'school',          label: 'Program',     value: 'B.Tech CSE' },
    { icon: 'event',           label: 'Semester',    value: '6' },
    { icon: 'phone',           label: 'Phone',       value: user?.phone ?? '—' },
    { icon: 'alternate-email', label: 'Email',       value: user?.email ?? '—' },
  ]

  const settings: Row[] = [
    { icon: 'notifications-none', label: 'Notifications' },
    { icon: 'lock-outline',       label: 'Change password' },
    { icon: 'help-outline',       label: 'Help & support' },
    { icon: 'info-outline',       label: 'About' },
  ]

  return (
    <View className="flex-1 bg-ink-50 dark:bg-ink-950">
      <ScreenHeader title="Profile" variant="large" />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80 }}>
        {/* Identity card */}
        <View
          style={{ backgroundColor: PORTAL_COLORS.STUDENT, borderRadius: 24 }}
          className="p-5 flex-row items-center"
        >
          <Avatar name={user?.name} size={64} tone="#FFFFFF" />
          <View className="ml-4 flex-1">
            <Text className="text-white text-xl font-bold" numberOfLines={1}>
              {user?.name ?? 'Student'}
            </Text>
            <Text className="text-white/80 text-sm mt-0.5">{user?.email}</Text>
            <View className="self-start mt-2 bg-white/20 px-2.5 py-1 rounded-full">
              <Text className="text-white text-xs font-semi">{user?.role}</Text>
            </View>
          </View>
        </View>

        <Text className="mt-6 mb-2 text-xs font-semi text-ink-500 uppercase tracking-wider">
          Personal info
        </Text>
        <Card>
          {personal.map((r, i) => (
            <View key={r.label}>
              <Row {...r} />
              {i < personal.length - 1 && <Divider />}
            </View>
          ))}
        </Card>

        <Text className="mt-6 mb-2 text-xs font-semi text-ink-500 uppercase tracking-wider">
          Settings
        </Text>
        <Card>
          {settings.map((r, i) => (
            <View key={r.label}>
              <Row {...r} chevron />
              {i < settings.length - 1 && <Divider />}
            </View>
          ))}
        </Card>

        <View className="mt-8">
          <Button
            label="Sign out"
            variant="danger"
            fullWidth
            leftIcon={<MaterialIcons name="logout" size={18} color="#fff" />}
            onPress={() =>
              Alert.alert('Sign out?', 'You will need to log in again.', [
                { text: 'Cancel' },
                { text: 'Sign out', style: 'destructive', onPress: () => logout() },
              ])
            }
          />
        </View>

        <Text className="text-center text-[11px] text-ink-400 mt-5">
          College ERP Mobile · v1.0.0
        </Text>
      </ScrollView>
    </View>
  )
}

function Row({
  icon,
  label,
  value,
  chevron,
  onPress,
}: Row & { chevron?: boolean }) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center py-3.5">
      <View
        style={{ backgroundColor: palette.ink[100] }}
        className="dark:bg-ink-800 w-9 h-9 rounded-xl items-center justify-center"
      >
        <MaterialIcons name={icon} size={18} color={palette.ink[600]} />
      </View>
      <View className="ml-3 flex-1">
        <Text className="text-sm text-ink-900 dark:text-ink-50">{label}</Text>
        {value && (
          <Text className="text-xs text-ink-500 dark:text-ink-400 mt-0.5" numberOfLines={1}>
            {value}
          </Text>
        )}
      </View>
      {chevron && <MaterialIcons name="chevron-right" size={20} color={palette.ink[400]} />}
    </Pressable>
  )
}

function Divider() {
  return <View className="h-px bg-ink-100 dark:bg-ink-800 -mx-4" />
}
