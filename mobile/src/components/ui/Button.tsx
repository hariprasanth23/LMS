import { ActivityIndicator, Pressable, PressableProps, Text, View } from 'react-native'
import * as Haptics from 'expo-haptics'
import { ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

type Props = Omit<PressableProps, 'children'> & {
  label: string
  variant?: Variant
  size?: Size
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  loading?: boolean
  fullWidth?: boolean
  haptic?: boolean
}

const VARIANTS: Record<Variant, { container: string; text: string; disabled: string }> = {
  primary:   { container: 'bg-brand-600 active:bg-brand-700',                                 text: 'text-white',        disabled: 'bg-brand-300' },
  secondary: { container: 'bg-ink-100 active:bg-ink-200 dark:bg-ink-800 dark:active:bg-ink-700', text: 'text-ink-900 dark:text-ink-50', disabled: 'bg-ink-200 dark:bg-ink-700' },
  ghost:     { container: 'bg-transparent active:bg-ink-100 dark:active:bg-ink-800',          text: 'text-brand-600 dark:text-brand-300', disabled: '' },
  danger:    { container: 'bg-danger-500 active:bg-danger-600',                               text: 'text-white',        disabled: 'bg-danger-100' },
}

const SIZES: Record<Size, { container: string; text: string; height: number }> = {
  sm: { container: 'px-3',  text: 'text-sm',  height: 36 },
  md: { container: 'px-4',  text: 'text-base', height: 48 },
  lg: { container: 'px-5',  text: 'text-lg',  height: 56 },
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  loading,
  fullWidth,
  haptic = true,
  disabled,
  onPress,
  ...rest
}: Props) {
  const v = VARIANTS[variant]
  const s = SIZES[size]
  const isDisabled = disabled || loading
  return (
    <Pressable
      {...rest}
      disabled={isDisabled}
      onPress={(e) => {
        if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        onPress?.(e)
      }}
      style={({ pressed }) => [{ height: s.height, opacity: pressed && !isDisabled ? 0.92 : 1 }]}
      className={[
        'rounded-2xl flex-row items-center justify-center',
        s.container,
        isDisabled ? v.disabled : v.container,
        fullWidth ? 'self-stretch' : '',
      ].join(' ')}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'primary' || variant === 'danger' ? '#fff' : '#4F46E5'} />
      ) : (
        <View className="flex-row items-center">
          {leftIcon && <View className="mr-2">{leftIcon}</View>}
          <Text className={`font-semi ${s.text} ${v.text}`}>{label}</Text>
          {rightIcon && <View className="ml-2">{rightIcon}</View>}
        </View>
      )}
    </Pressable>
  )
}
