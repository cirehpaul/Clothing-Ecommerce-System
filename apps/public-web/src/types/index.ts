// ============================================
// SHARED TYPES
// ============================================

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string | null
  avatar?: string | null
  role: 'admin' | 'staff' | 'customer'
  isActive: boolean
  emailVerified: boolean
  createdAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  image?: string | null
  banner?: string | null
  parentId?: string | null
  sortOrder: number
  isActive: boolean
  children?: Category[]
}

export interface ProductImage {
  id: string
  productId: string
  url: string
  altText?: string | null
  sortOrder: number
  isPrimary: boolean
}

export interface Size {
  id: string
  name: string
  sortOrder: number
}

export interface Color {
  id: string
  name: string
  hexCode: string
  sortOrder: number
}

export interface ProductVariant {
  id: string
  productId: string
  sizeId: string
  colorId: string
  sku: string
  stock: number
  price?: string | null
  isActive: boolean
  size: Size
  color: Color
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string | null
  categoryId?: string | null
  brand?: string | null
  material?: string | null
  price: string
  salePrice?: string | null
  discount?: number | null
  sku: string
  barcode?: string | null
  totalStock: number
  isFeatured: boolean
  isBestSeller: boolean
  isNewArrival: boolean
  isArchived: boolean
  averageRating?: string | null
  totalReviews: number
  createdAt: string
  updatedAt: string
  // Joined
  category?: Category | null
  images?: ProductImage[]
  variants?: ProductVariant[]
  reviews?: Review[]
  relatedProducts?: ProductListItem[]
  availableSizes?: Size[]
  availableColors?: Color[]
  // Computed
  image?: string | null
  isWishlisted?: boolean
}

export interface ProductListItem {
  id: string
  name: string
  slug: string
  price: string
  salePrice?: string | null
  discount?: number | null
  brand?: string | null
  totalStock: number
  isFeatured: boolean
  isBestSeller: boolean
  isNewArrival: boolean
  averageRating?: string | null
  totalReviews: number
  image?: string | null
  isWishlisted?: boolean
}

export interface Review {
  id: string
  userId: string
  productId: string
  rating: number
  title?: string | null
  comment?: string | null
  isVerified: boolean
  createdAt: string
  user?: {
    id: string
    firstName: string
    lastName: string
    avatar?: string | null
  }
}

export interface Address {
  id: string
  userId: string
  label: string
  fullName: string
  phone: string
  addressLine: string
  province: string
  city: string
  barangay: string
  postalCode: string
  landmark?: string | null
  deliveryInstructions?: string | null
  isDefault: boolean
}

export interface CartItem {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    slug: string
    price: string
    salePrice?: string | null
    discount?: number | null
    image?: string | null
  }
  variant: {
    id: string
    stock: number
    size: Size
    color: Color
    price?: string | null
  }
}

export interface Cart {
  id: string
  items: CartItem[]
  savedItems: CartItem[]
  total: string
  itemCount: number
}

export interface Order {
  id: string
  orderNumber: string
  userId?: string | null
  addressId?: string | null
  status: OrderStatus
  subtotal: string
  shippingFee: string
  discount: string
  grandTotal: string
  shippingMethod?: string | null
  paymentMethod: PaymentMethod
  notes?: string | null
  shippingAddress?: ShippingAddress | null
  createdAt: string
  updatedAt: string
  items: OrderItem[]
  payments?: Payment[]
  shipment?: Shipment[]
  address?: Address | null
  user?: {
    id: string
    firstName: string
    lastName: string
    email: string
  } | null
}

export interface OrderItem {
  id: string
  orderId: string
  productId?: string | null
  variantId?: string | null
  productName: string
  productImage?: string | null
  sizeName?: string | null
  colorName?: string | null
  price: string
  quantity: number
  total: string
}

export interface ShippingAddress {
  fullName: string
  phone: string
  addressLine: string
  province: string
  city: string
  barangay: string
  postalCode: string
  landmark?: string | null
}

export interface Payment {
  id: string
  orderId: string
  method: PaymentMethod
  amount: string
  status: PaymentStatus
  referenceNumber?: string | null
  verifiedBy?: string | null
  verifiedAt?: string | null
  createdAt: string
  proofs?: PaymentProof[]
}

export interface PaymentProof {
  id: string
  paymentId: string
  imageUrl: string
  uploadedAt: string
}

export interface Shipment {
  id: string
  orderId: string
  trackingNumber?: string | null
  carrier?: string | null
  status?: string | null
  estimatedDelivery?: string | null
  shippedAt?: string | null
  deliveredAt?: string | null
}

export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  data?: Record<string, unknown> | null
  isRead: boolean
  createdAt: string
}

export interface Coupon {
  id: string
  code: string
  description?: string | null
  type: 'percentage' | 'fixed'
  value: string
  minPurchase?: string | null
  maxDiscount?: string | null
  usageLimit?: number | null
  usedCount: number
  startsAt?: string | null
  expiresAt?: string | null
  isActive: boolean
}

export interface DashboardData {
  today: { totalOrders: number; totalRevenue: string }
  monthly: { totalOrders: number; totalRevenue: string }
  totalProducts: number
  totalCustomers: number
  pendingOrders: number
  lowStock: Array<{ id: string; name: string; sku: string; totalStock: number }>
  recentOrders: Order[]
  salesChart: Array<{ date: string; orders: number; revenue: string }>
}

// Enums
export type OrderStatus =
  | 'pending' | 'waiting_payment' | 'payment_verified'
  | 'preparing' | 'packing' | 'shipped' | 'out_for_delivery'
  | 'delivered' | 'cancelled' | 'refunded'

export type PaymentMethod = 'gcash' | 'maya' | 'cod' | 'bank_transfer'
export type PaymentStatus = 'pending' | 'verified' | 'rejected' | 'refunded'
export type UserRole = 'admin' | 'staff' | 'customer'

// API Response
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  meta?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
