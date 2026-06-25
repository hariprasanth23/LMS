import { Tabs, Redirect } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
import { useColorScheme, View } from 'react-native'
import { palette, PORTAL_COLORS } from '@/theme/tokens'
import { useAuth } from '@/context/AuthContext'

export default function FacultyTabsLayout() {
  const { user, loading } = useAuth()
  const scheme = useColorScheme()
  if (loading) return <View className="flex-1 bg-ink-50 dark:bg-ink-950" />
  if (!user) return <Redirect href="/(auth)/portal" />

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: PORTAL_COLORS.FACULTY,
        tabBarInactiveTintColor: scheme === 'dark' ? palette.ink[500] : palette.ink[400],
        tabBarStyle: {
          backgroundColor: scheme === 'dark' ? palette.ink[900] : '#FFFFFF',
          borderTopColor: scheme === 'dark' ? palette.ink[800] : palette.ink[100],
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: ({ color, size }) => <MaterialIcons name="home" color={color} size={size} /> }} />
      <Tabs.Screen name="classes/index" options={{ title: 'Classes', tabBarIcon: ({ color, size }) => <MaterialIcons name="book" color={color} size={size} /> }} />
      <Tabs.Screen name="attendance" options={{ title: 'Mark', tabBarIcon: ({ color, size }) => <MaterialIcons name="event-available" color={color} size={size} /> }} />
      <Tabs.Screen name="leaves" options={{ title: 'Leaves', tabBarIcon: ({ color, size }) => <MaterialIcons name="beach-access" color={color} size={size} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <MaterialIcons name="person" color={color} size={size} /> }} />
      <Tabs.Screen name="announcements" options={{ href: null }} />
      <Tabs.Screen name="classes/[id]" options={{ href: null }} />
    </Tabs>
  )
}
