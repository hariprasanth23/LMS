import { ReactNode } from 'react'
import { ScrollView, View, ScrollViewProps, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { palette } from '@/theme/tokens'

type Props = ScrollViewProps & {
  scroll?: boolean
  children: ReactNode
  refreshing?: boolean
  onRefresh?: () => void
}

/** Standard screen container — safe area top, scrollable by default. */
export function Screen({ scroll = true, children, refreshing, onRefresh, ...rest }: Props) {
  const content = scroll ? (
    <ScrollView
      {...rest}
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={!!refreshing}
            onRefresh={onRefresh}
            tintColor={palette.brand[500]}
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  ) : (
    <View className="flex-1">{children}</View>
  )
  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-ink-50 dark:bg-ink-950">
      {content}
    </SafeAreaView>
  )
}
