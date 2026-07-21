import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

export function useHomepageData() {
  return useQuery({
    queryKey: ['storefront-homepage'],
    queryFn: async () => {
      const { data } = await api.get('/store/homepage')
      return data.data
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useStoreSettings() {
  return useQuery({
    queryKey: ['storefront-settings'],
    queryFn: async () => {
      const { data } = await api.get('/store/settings')
      return data.data
    },
    staleTime: 1000 * 60 * 60,
  })
}
