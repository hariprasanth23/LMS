import { Pressable, PressableProps, View, ViewProps } from 'react-native'

type Props = ViewProps & {
  pressable?: boolean
  onPress?: PressableProps['onPress']
}

export function Card({ children, pressable, onPress, className, ...rest }: Props) {
  const cls = `bg-white dark:bg-ink-900 rounded-2xl border border-ink-100 dark:border-ink-800 p-4 ${className ?? ''}`
  if (pressable) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [{ opacity: pressed ? 0.94 : 1 }]}
        className={cls}
      >
        {children}
      </Pressable>
    )
  }
  return (
    <View {...rest} className={cls}>
      {children}
    </View>
  )
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <View className="mb-2">{children}</View>
}
