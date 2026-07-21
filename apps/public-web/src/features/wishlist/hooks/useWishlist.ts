import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/stores/authStore'

export function useWishlist() {
  const { isAuthenticated } = useAuthStore()
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const { data } = await api.get('/wishlists')
      return data.data
    },
    enabled: isAuthenticated,
  })
}

export function useToggleWishlist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await api.post('/wishlists', { productId })
      return data
    },
    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: ['wishlist'] })
      qc.invalidateQueries({ queryKey: ['products'] })
      qc.invalidateQueries({ queryKey: ['product'] })
      toast.success(data?.wishlisted ? 'Added to wishlist' : 'Removed from wishlist')
    },
    onError: () => toast.error('Failed to update wishlist'),
  })
}
