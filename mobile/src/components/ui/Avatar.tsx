import { Text, View } from 'react-native'
import { Image } from 'expo-image'

type Props = {
  name?: string
  uri?: string
  size?: number
  tone?: string
}

function initials(name?: string) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
}

export function Avatar({ name, uri, size = 40, tone = '#6366F1' }: Props) {
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        contentFit="cover"
      />
    )
  }
  return (
    <View
      style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: tone + '22' }}
      className="items-center justify-center"
    >
      <Text style={{ color: tone, fontWeight: '600', fontSize: size * 0.4 }}>
        {initials(name)}
      </Text>
    </View>
  )
}
