import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import type { Notification } from '@/types'

export function useNotifications() {
  const { isAuthenticated } = useAuthStore()

  const { data, ...rest } = useQuery<{ data: Notification[]; unreadCount: number }>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await api.get('/notifications')
      return data
    },
    enabled: isAuthenticated,
    refetchInterval: 30000, // poll every 30s
  })

  return {
    notifications: data?.data || [],
    unreadCount: data?.unreadCount || 0,
    ...rest,
  }
}
