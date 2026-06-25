import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { apiGet } from '@/lib/api'

/**
 * Thin wrapper around React Query that calls `apiGet(path)` and unwraps the
 * ApiResponse envelope. Returns the same React Query result shape so callers
 * use isLoading / data / refetch normally.
 */
export function useApiQuery<T>(
  key: readonly unknown[],
  path: string,
  options?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T, Error>({
    queryKey: key,
    queryFn: () => apiGet<T>(path),
    staleTime: 30_000,
    ...options,
  })
}
