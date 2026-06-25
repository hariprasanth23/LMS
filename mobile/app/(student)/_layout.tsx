import { Tabs, Redirect } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
import { palette } from '@/theme/tokens'
import { useAuth } from '@/context/AuthContext'
import { useColorScheme, View } from 'react-native'

export default function StudentTabsLayout() {
  const { user, loading } = useAuth()
  const scheme = useColorScheme()
  if (loading) return <View className="flex-1 bg-ink-50 dark:bg-ink-950" />
  if (!user) return <Redirect href="/(auth)/portal" />

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.brand[600],
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
      <Tabs.Screen
        name="home"
        options={{ title: 'Home', tabBarIcon: ({ color, size }) => <MaterialIcons name="home" color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="courses"
        options={{ title: 'Courses', tabBarIcon: ({ color, size }) => <MaterialIcons name="book" color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="attendance"
        options={{ title: 'Attendance', tabBarIcon: ({ color, size }) => <MaterialIcons name="event-available" color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="results"
        options={{ title: 'Results', tabBarIcon: ({ color, size }) => <MaterialIcons name="grade" color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <MaterialIcons name="person" color={color} size={size} /> }}
      />
      <Tabs.Screen name="timetable" options={{ href: null }} />
      <Tabs.Screen name="fees" options={{ href: null }} />
    </Tabs>
  )
}
