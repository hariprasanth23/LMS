import { ActivityIndicator, View } from 'react-native'
import { palette } from '@/theme/tokens'

export function Spinner({ size = 'large' as 'small' | 'large' }: { size?: 'small' | 'large' }) {
  return (
    <View className="flex-1 items-center justify-center py-10">
      <ActivityIndicator size={size} color={palette.brand[500]} />
    </View>
  )
}
