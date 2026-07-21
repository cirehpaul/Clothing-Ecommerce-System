import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import type { ProductListItem, Product } from '@/types'
import { useAuthStore } from '@/stores/authStore'

interface ProductFilters {
  page?: number
  limit?: number
  search?: string
  category?: string
  minPrice?: string
  maxPrice?: string
  sort?: string
  size?: string
  color?: string
}

export function useProducts(filters: ProductFilters = {}) {
  return useQuery<{ data: ProductListItem[]; meta: any }>({
    queryKey: ['products', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, String(v)) })
      const { data } = await api.get(`/products?${params}`)
      return data as { data: ProductListItem[]; meta: any }
    },
    placeholderData: (prev) => prev,
  })
}

export function useSearchProducts(query: string) {
  return useQuery<ProductListItem[]>({
    queryKey: ['products-search', query],
    queryFn: async () => {
      if (!query || query.length < 2) return []
      const { data } = await api.get(`/products?search=${encodeURIComponent(query)}&limit=10`)
      return data.data
    },
    enabled: query.length >= 2,
  })
}

export function useProductDetail(slug: string) {
  return useQuery<Product>({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data } = await api.get(`/products/${slug}`)
      return data.data
    },
    enabled: !!slug,
  })
}

export function useFeaturedProducts() {
  return useQuery<ProductListItem[]>({
    queryKey: ['products-featured'],
    queryFn: async () => {
      const { data } = await api.get('/products/featured?limit=8')
      return data.data
    },
    staleTime: 1000 * 60 * 10,
  })
}

export function useNewArrivals() {
  return useQuery<ProductListItem[]>({
    queryKey: ['products-new-arrivals'],
    queryFn: async () => {
      const { data } = await api.get('/products/new-arrivals?limit=8')
      return data.data
    },
    staleTime: 1000 * 60 * 10,
  })
}

export function useBestSellers() {
  return useQuery<ProductListItem[]>({
    queryKey: ['products-best-sellers'],
    queryFn: async () => {
      const { data } = await api.get('/products/best-sellers?limit=8')
      return data.data
    },
    staleTime: 1000 * 60 * 10,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories')
      return data.data
    },
    staleTime: 1000 * 60 * 30,
  })
}
