export const MOCK_CATEGORIES = [
  { id: '1', name: 'T-Shirts', slug: 't-shirts', description: 'Premium quality t-shirts for every occasion', sortOrder: 1 },
  { id: '2', name: 'Polo Shirts', slug: 'polo-shirts', description: 'Classic and modern polo shirts', sortOrder: 2 },
  { id: '3', name: 'Hoodies', slug: 'hoodies', description: 'Comfortable hoodies and sweatshirts', sortOrder: 3 },
  { id: '4', name: 'Long Sleeves', slug: 'long-sleeves', description: 'Stylish long sleeve shirts', sortOrder: 4 },
  { id: '5', name: 'Tank Tops', slug: 'tank-tops', description: 'Cool and casual tank tops', sortOrder: 5 },
  { id: '6', name: 'Oversized', slug: 'oversized', description: 'Trendy oversized fits', sortOrder: 6 },
];

export const MOCK_PRODUCTS = [
  {
    id: 'p1',
    name: 'Essential Cotton Tee',
    slug: 'essential-cotton-tee',
    description: 'A timeless essential crafted from 100% premium combed cotton. Features a relaxed fit, reinforced collar, and ultra-soft hand feel. Perfect for everyday styling.',
    categoryId: '1',
    brand: 'JŌNEL',
    material: '100% Combed Cotton',
    price: '899.00',
    salePrice: '699.00',
    discount: 22,
    sku: 'JNL-ECT-001',
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    totalStock: 150,
    averageRating: '4.8',
    totalReviews: 24,
    images: [
      { id: 'i1', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', isPrimary: true },
      { id: 'i2', url: 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=800&q=80', isPrimary: false },
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'p2',
    name: 'Urban Graphic Tee',
    slug: 'urban-graphic-tee',
    description: 'Bold graphic print on premium heavyweight cotton. Pre-shrunk fabric with a modern boxy silhouette. Statement piece for the streetwear enthusiast.',
    categoryId: '1',
    brand: 'JŌNEL',
    material: 'Heavyweight Cotton 220gsm',
    price: '1299.00',
    salePrice: null,
    discount: 0,
    sku: 'JNL-UGT-002',
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    totalStock: 80,
    averageRating: '4.9',
    totalReviews: 56,
    images: [
      { id: 'i3', url: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80', isPrimary: true },
      { id: 'i4', url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80', isPrimary: false },
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'p3',
    name: 'Classic Polo Oxford',
    slug: 'classic-polo-oxford',
    description: 'Refined oxford polo with a modern slim fit. Features mother-of-pearl buttons, ribbed collar, and embroidered logo. Versatile enough for both casual and smart-casual occasions.',
    categoryId: '2',
    brand: 'JŌNEL',
    material: 'Cotton Piqué',
    price: '1599.00',
    salePrice: '1299.00',
    discount: 19,
    sku: 'JNL-CPO-003',
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    totalStock: 120,
    averageRating: '4.7',
    totalReviews: 89,
    images: [
      { id: 'i5', url: 'https://images.unsplash.com/photo-1625910513413-5fc421e0fd5d?w=800&q=80', isPrimary: true },
      { id: 'i6', url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736c10?w=800&q=80', isPrimary: false },
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'p4',
    name: 'Minimalist Hoodie',
    slug: 'minimalist-hoodie',
    description: 'Clean-lined pullover hoodie in premium French terry. Features a kangaroo pocket, adjustable drawcord hood, and ribbed cuffs. The perfect layer for transitional weather.',
    categoryId: '3',
    brand: 'JŌNEL',
    material: 'French Terry 350gsm',
    price: '2499.00',
    salePrice: '1999.00',
    discount: 20,
    sku: 'JNL-MNH-004',
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    totalStock: 60,
    averageRating: '4.6',
    totalReviews: 12,
    images: [
      { id: 'i7', url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80', isPrimary: true },
      { id: 'i8', url: 'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800&q=80', isPrimary: false },
    ],
    createdAt: new Date().toISOString()
  },
];

export const MOCK_ORDERS = [
  {
    id: 'ORD-1234',
    customerName: 'Maria Santos',
    customerEmail: 'maria@example.com',
    status: 'delivered',
    total: '2598.00',
    items: 2,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'ORD-1235',
    customerName: 'Juan Dela Cruz',
    customerEmail: 'juan@example.com',
    status: 'processing',
    total: '899.00',
    items: 1,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'ORD-1236',
    customerName: 'Ana Reyes',
    customerEmail: 'ana@example.com',
    status: 'pending',
    total: '1299.00',
    items: 1,
    createdAt: new Date().toISOString(),
  }
];

export const MOCK_STATS = {
  today: { totalOrders: 12, totalRevenue: '15890.00' },
  monthly: { totalOrders: 342, totalRevenue: '450000.00' },
  totalProducts: MOCK_PRODUCTS.length,
  totalCustomers: 128,
  pendingOrders: 3,
  lowStock: [
    { id: 'p1', name: 'Essential Cotton Tee', sku: 'JNL-ECT-001', totalStock: 5 }
  ],
  recentOrders: MOCK_ORDERS,
  salesChart: [
    { date: '2024-01-15', orders: 12, revenue: '4000' },
    { date: '2024-01-16', orders: 18, revenue: '3000' },
    { date: '2024-01-17', orders: 15, revenue: '5200' },
    { date: '2024-01-18', orders: 20, revenue: '2780' },
    { date: '2024-01-19', orders: 10, revenue: '1890' },
    { date: '2024-01-20', orders: 14, revenue: '2390' },
    { date: '2024-01-21', orders: 25, revenue: '3490' },
  ],
};

