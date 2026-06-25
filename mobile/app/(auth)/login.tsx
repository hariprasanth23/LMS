import { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
import Toast from 'react-native-toast-message'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth, homeForRole } from '@/context/AuthContext'
import { PORTAL_COLORS, PORTAL_LABELS, palette } from '@/theme/tokens'
import { PortalKey } from '@/types'

export default function LoginScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{ portal?: PortalKey }>()
  const portal: PortalKey = (params.portal as PortalKey) || 'STUDENT'
  const { login } = useAuth()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const accent = PORTAL_COLORS[portal]

  const submit = async () => {
    setError(null)
    if (!identifier.trim() || !password) {
      setError('Email and password are required')
      return
    }
    setSubmitting(true)
    try {
      const user = await login(identifier.trim(), password, portal)
      Toast.show({
        type: 'success',
        text1: `Welcome, ${user.name.split(' ')[0]}`,
        text2: `Signed in as ${user.role}`,
      })
      router.replace(homeForRole(user.role) as any)
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? 'Invalid credentials'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-ink-50 dark:bg-ink-950" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="px-6 pt-2">
            <Pressable
              hitSlop={12}
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 items-center justify-center"
            >
              <MaterialIcons name="arrow-back" size={22} color={palette.ink[700]} />
            </Pressable>

            <View className="mt-8 flex-row items-center">
              <View
                style={{ backgroundColor: accent + '1A' }}
                className="w-14 h-14 rounded-2xl items-center justify-center mr-3"
              >
                <MaterialIcons name="login" size={28} color={accent} />
              </View>
              <View>
                <Text className="text-2xl font-bold text-ink-900 dark:text-ink-50">Sign in</Text>
                <Text className="text-sm text-ink-500 dark:text-ink-400">
                  {PORTAL_LABELS[portal]} portal
                </Text>
              </View>
            </View>

            <View className="mt-8 gap-4">
              <Input
                label="Email or Phone"
                placeholder="you@college.edu"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                icon="alternate-email"
                value={identifier}
                onChangeText={setIdentifier}
                returnKeyType="next"
              />
              <Input
                label="Password"
                placeholder="Your password"
                icon="lock-outline"
                secureTextEntry
                secureToggle
                value={password}
                onChangeText={setPassword}
                returnKeyType="go"
                onSubmitEditing={submit}
              />
              {error && (
                <View className="rounded-2xl bg-danger-100 dark:bg-danger-500/10 px-4 py-3 flex-row items-start">
                  <MaterialIcons
                    name="error-outline"
                    size={18}
                    color={palette.semantic.danger}
                    style={{ marginTop: 1, marginRight: 6 }}
                  />
                  <Text className="flex-1 text-sm text-danger-600">{error}</Text>
                </View>
              )}

              <Button
                label={submitting ? 'Signing in…' : 'Sign in'}
                size="lg"
                loading={submitting}
                onPress={submit}
                fullWidth
              />

              <Pressable hitSlop={8}>
                <Text className="text-center text-sm text-brand-600 dark:text-brand-300 mt-2">
                  Forgot password?
                </Text>
              </Pressable>
            </View>

            <View className="mt-10 p-4 rounded-2xl bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800">
              <Text className="text-xs font-semi text-ink-500 dark:text-ink-400 mb-2">
                DEMO ACCOUNTS · password: Demo@123
              </Text>
              <View className="gap-1">
                <Text className="text-sm text-ink-700 dark:text-ink-200">
                  • Student → student1@sample.edu
                </Text>
                <Text className="text-sm text-ink-700 dark:text-ink-200">
                  • Faculty → faculty1@sample.edu
                </Text>
                <Text className="text-sm text-ink-700 dark:text-ink-200">
                  • Parent  → parent1@sample.edu
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
