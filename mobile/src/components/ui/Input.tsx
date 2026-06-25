import { useState, forwardRef } from 'react'
import { TextInput, TextInputProps, View, Text, Pressable } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { palette } from '@/theme/tokens'

type Props = TextInputProps & {
  label?: string
  error?: string
  icon?: keyof typeof MaterialIcons.glyphMap
  secureToggle?: boolean
  hint?: string
}

export const Input = forwardRef<TextInput, Props>(function Input(
  { label, error, icon, secureToggle, hint, secureTextEntry, ...rest },
  ref
) {
  const [focused, setFocused] = useState(false)
  const [hidden, setHidden] = useState(!!secureTextEntry)
  const borderColor = error
    ? 'border-danger-500'
    : focused
      ? 'border-brand-500'
      : 'border-ink-200 dark:border-ink-700'
  return (
    <View className="w-full">
      {label && (
        <Text className="mb-1.5 text-sm font-medium text-ink-700 dark:text-ink-200">{label}</Text>
      )}
      <View className={`flex-row items-center rounded-2xl border ${borderColor} bg-white dark:bg-ink-900 px-4 h-12`}>
        {icon && (
          <MaterialIcons
            name={icon}
            size={20}
            color={focused ? palette.brand[500] : palette.ink[400]}
            style={{ marginRight: 8 }}
          />
        )}
        <TextInput
          ref={ref}
          {...rest}
          secureTextEntry={hidden}
          onFocus={(e) => {
            setFocused(true)
            rest.onFocus?.(e)
          }}
          onBlur={(e) => {
            setFocused(false)
            rest.onBlur?.(e)
          }}
          placeholderTextColor={palette.ink[400]}
          className="flex-1 text-base text-ink-900 dark:text-ink-50"
        />
        {secureToggle && secureTextEntry && (
          <Pressable hitSlop={8} onPress={() => setHidden((h) => !h)}>
            <MaterialIcons
              name={hidden ? 'visibility' : 'visibility-off'}
              size={20}
              color={palette.ink[400]}
            />
          </Pressable>
        )}
      </View>
      {error ? (
        <Text className="mt-1 text-xs text-danger-500">{error}</Text>
      ) : hint ? (
        <Text className="mt-1 text-xs text-ink-500 dark:text-ink-400">{hint}</Text>
      ) : null}
    </View>
  )
})
