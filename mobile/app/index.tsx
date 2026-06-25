import { useEffect } from 'react'
import { Redirect } from 'expo-router'
import { ActivityIndicator, View } from 'react-native'
import { useAuth, homeForRole } from '@/context/AuthContext'
import { palette } from '@/theme/tokens'

/**
 * Root route — splash while we hydrate persisted session, then redirect.
 *   No session → portal picker.
 *   Has session → portal home for the user's role.
 */
export default function Index() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-ink-50 dark:bg-ink-950">
        <ActivityIndicator size="large" color={palette.brand[500]} />
      </View>
    )
  }

  return <Redirect href={user ? (homeForRole(user.role) as any) : '/(auth)/portal'} />
}
