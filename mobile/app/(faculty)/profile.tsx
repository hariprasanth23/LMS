import { Alert, Pressable, ScrollView, Text, View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { palette, PORTAL_COLORS } from '@/theme/tokens'

export default function FacultyProfile() {
  const { user, logout } = useAuth()

  return (
    <View className="flex-1 bg-ink-50 dark:bg-ink-950">
      <ScreenHeader title="Profile" variant="large" />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80 }}>
        <View style={{ backgroundColor: PORTAL_COLORS.FACULTY, borderRadius: 24 }} className="p-5 flex-row items-center">
          <Avatar name={user?.name} size={64} tone="#FFFFFF" />
          <View className="ml-4 flex-1">
            <Text className="text-white text-xl font-bold" numberOfLines={1}>{user?.name ?? 'Faculty'}</Text>
            <Text className="text-white/80 text-sm mt-0.5">{user?.email}</Text>
            <View className="self-start mt-2 bg-white/20 px-2.5 py-1 rounded-full">
              <Text className="text-white text-xs font-semi">{user?.role}</Text>
            </View>
          </View>
        </View>

        <Text className="mt-6 mb-2 text-xs font-semi text-ink-500 uppercase tracking-wider">Details</Text>
        <Card>
          {[
            { icon: 'badge' as const,           label: 'Employee code', value: 'EMP001' },
            { icon: 'work-outline' as const,    label: 'Designation',   value: 'Associate Professor' },
            { icon: 'apartment' as const,       label: 'Department',    value: 'Computer Science' },
            { icon: 'phone' as const,           label: 'Phone',         value: user?.phone ?? '—' },
            { icon: 'alternate-email' as const, label: 'Email',         value: user?.email ?? '—' },
          ].map((r, i, arr) => (
            <View key={r.label}>
              <View className="flex-row items-center py-3.5">
                <View style={{ backgroundColor: palette.ink[100] }} className="dark:bg-ink-800 w-9 h-9 rounded-xl items-center justify-center">
                  <MaterialIcons name={r.icon} size={18} color={palette.ink[600]} />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-sm text-ink-900 dark:text-ink-50">{r.label}</Text>
                  <Text className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">{r.value}</Text>
                </View>
              </View>
              {i < arr.length - 1 && <View className="h-px bg-ink-100 dark:bg-ink-800 -mx-4" />}
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
      </ScrollView>
    </View>
  )
}
