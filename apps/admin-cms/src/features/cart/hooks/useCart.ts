import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import type { Cart } from '@/types'
import { useAuthStore } from '@/stores/authStore'

export function useCart() {
  const { isAuthenticated } = useAuthStore()
  return useQuery<Cart>({
    queryKey: ['cart'],
    queryFn: async () => {
      const { data } = await api.get('/cart')
      return data.data
    },
    enabled: isAuthenticated,
    staleTime: 0,
  })
}

export function useAddToCart() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { productId: string; variantId: string; quantity: number }) => {
      const { data } = await api.post('/cart/items', payload)
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cart'] })
      toast.success('Added to cart!')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to add to cart')
    },
  })
}

export function useUpdateCartItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const { data } = await api.put(`/cart/items/${id}`, { quantity })
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }),
    onError: (err: any) => toast.error(err.response?.data?.error || 'Failed to update'),
  })
}

export function useRemoveCartItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/cart/items/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cart'] })
      toast.success('Item removed')
    },
  })
}

export function useSaveForLater() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/cart/items/${id}/save-for-later`)
      return data
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['cart'] })
      toast.success(data.message || 'Updated')
    },
  })
}
