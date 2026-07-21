import { pgTable, text, timestamp, boolean, integer, decimal, uuid, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ── Enums ──────────────────────────────────────────────
export const userRoleEnum = pgEnum('user_role', ['admin', 'staff', 'customer']);
export const orderStatusEnum = pgEnum('order_status', [
  'pending', 'waiting_payment', 'payment_verified', 'preparing',
  'packing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'
]);
export const paymentMethodEnum = pgEnum('payment_method', ['gcash', 'maya', 'cod', 'bank_transfer']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'verified', 'rejected', 'refunded']);
export const couponTypeEnum = pgEnum('coupon_type', ['percentage', 'fixed']);
export const bannerTypeEnum = pgEnum('banner_type', ['hero', 'promotional', 'flash_sale']);

// ── Users ──────────────────────────────────────────────
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  phone: text('phone'),
  avatar: text('avatar'),
  role: userRoleEnum('role').notNull().default('customer'),
  isActive: boolean('is_active').notNull().default(true),
  emailVerified: boolean('email_verified').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ── Categories ─────────────────────────────────────────
export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  image: text('image'),
  banner: text('banner'),
  parentId: uuid('parent_id'),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ── Products ───────────────────────────────────────────
export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  categoryId: uuid('category_id').references(() => categories.id),
  brand: text('brand'),
  material: text('material'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  salePrice: decimal('sale_price', { precision: 10, scale: 2 }),
  discount: integer('discount').default(0),
  sku: text('sku').notNull().unique(),
  barcode: text('barcode'),
  totalStock: integer('total_stock').notNull().default(0),
  isFeatured: boolean('is_featured').notNull().default(false),
  isBestSeller: boolean('is_best_seller').notNull().default(false),
  isNewArrival: boolean('is_new_arrival').notNull().default(false),
  isArchived: boolean('is_archived').notNull().default(false),
  isVisible: boolean('is_visible').notNull().default(true),
  averageRating: decimal('average_rating', { precision: 3, scale: 1 }).default('0'),
  totalReviews: integer('total_reviews').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ── Product Images ─────────────────────────────────────
export const productImages = pgTable('product_images', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  altText: text('alt_text'),
  sortOrder: integer('sort_order').notNull().default(0),
  isPrimary: boolean('is_primary').notNull().default(false),
});

// ── Sizes ──────────────────────────────────────────────
export const sizes = pgTable('sizes', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  sortOrder: integer('sort_order').notNull().default(0),
});

// ── Colors ─────────────────────────────────────────────
export const colors = pgTable('colors', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  hexCode: text('hex_code').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
});

// ── Product Variants ───────────────────────────────────
export const productVariants = pgTable('product_variants', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  sizeId: uuid('size_id').notNull().references(() => sizes.id),
  colorId: uuid('color_id').notNull().references(() => colors.id),
  sku: text('sku').notNull().unique(),
  stock: integer('stock').notNull().default(0),
  price: decimal('price', { precision: 10, scale: 2 }),
  isActive: boolean('is_active').notNull().default(true),
});

// ── Orders ─────────────────────────────────────────────
export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderNumber: text('order_number').notNull().unique(),
  userId: uuid('user_id').references(() => users.id),
  status: orderStatusEnum('status').notNull().default('pending'),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  shippingFee: decimal('shipping_fee', { precision: 10, scale: 2 }).notNull().default('0'),
  discount: decimal('discount', { precision: 10, scale: 2 }).notNull().default('0'),
  grandTotal: decimal('grand_total', { precision: 10, scale: 2 }).notNull(),
  couponCode: text('coupon_code'),
  paymentMethod: paymentMethodEnum('payment_method').notNull().default('gcash'),
  notes: text('notes'),
  shippingFullName: text('shipping_full_name'),
  shippingPhone: text('shipping_phone'),
  shippingAddress: text('shipping_address'),
  shippingProvince: text('shipping_province'),
  shippingCity: text('shipping_city'),
  shippingBarangay: text('shipping_barangay'),
  shippingPostalCode: text('shipping_postal_code'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ── Order Items ────────────────────────────────────────
export const orderItems = pgTable('order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').references(() => products.id),
  variantId: uuid('variant_id').references(() => productVariants.id),
  productName: text('product_name').notNull(),
  productImage: text('product_image'),
  sizeName: text('size_name'),
  colorName: text('color_name'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  quantity: integer('quantity').notNull(),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
});

// ── Payments ───────────────────────────────────────────
export const payments = pgTable('payments', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  method: paymentMethodEnum('method').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  status: paymentStatusEnum('status').notNull().default('pending'),
  referenceNumber: text('reference_number'),
  proofUrl: text('proof_url'),
  verifiedBy: uuid('verified_by').references(() => users.id),
  verifiedAt: timestamp('verified_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ── Shipments ──────────────────────────────────────────
export const shipments = pgTable('shipments', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  trackingNumber: text('tracking_number'),
  carrier: text('carrier'),
  status: text('status'),
  estimatedDelivery: timestamp('estimated_delivery'),
  shippedAt: timestamp('shipped_at'),
  deliveredAt: timestamp('delivered_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ── Reviews ────────────────────────────────────────────
export const reviews = pgTable('reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(),
  title: text('title'),
  comment: text('comment'),
  isVerified: boolean('is_verified').notNull().default(false),
  isApproved: boolean('is_approved').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ── Coupons ────────────────────────────────────────────
export const coupons = pgTable('coupons', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: text('code').notNull().unique(),
  description: text('description'),
  type: couponTypeEnum('type').notNull(),
  value: decimal('value', { precision: 10, scale: 2 }).notNull(),
  minPurchase: decimal('min_purchase', { precision: 10, scale: 2 }),
  maxDiscount: decimal('max_discount', { precision: 10, scale: 2 }),
  usageLimit: integer('usage_limit'),
  usedCount: integer('used_count').notNull().default(0),
  startsAt: timestamp('starts_at'),
  expiresAt: timestamp('expires_at'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ── Banners ────────────────────────────────────────────
export const banners = pgTable('banners', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  imageUrl: text('image_url').notNull(),
  linkUrl: text('link_url'),
  buttonText: text('button_text'),
  type: bannerTypeEnum('type').notNull().default('hero'),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  startsAt: timestamp('starts_at'),
  endsAt: timestamp('ends_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ── Announcements ──────────────────────────────────────
export const announcements = pgTable('announcements', {
  id: uuid('id').defaultRandom().primaryKey(),
  message: text('message').notNull(),
  linkUrl: text('link_url'),
  bgColor: text('bg_color').default('#111111'),
  textColor: text('text_color').default('#FFFFFF'),
  isActive: boolean('is_active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ── Site Settings (Key-Value) ──────────────────────────
export const siteSettings = pgTable('site_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  group: text('group').notNull().default('general'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ── Content Pages ──────────────────────────────────────
export const contentPages = pgTable('content_pages', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(),
  isPublished: boolean('is_published').notNull().default(true),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ── Homepage Sections ──────────────────────────────────
export const homepageSections = pgTable('homepage_sections', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  type: text('type').notNull(), // 'featured', 'new_arrivals', 'best_sellers', 'flash_sale', 'categories', 'testimonials'
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  config: text('config'), // JSON config (limit, style, etc.)
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ── Testimonials ───────────────────────────────────────
export const testimonials = pgTable('testimonials', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  avatar: text('avatar'),
  role: text('role'),
  content: text('content').notNull(),
  rating: integer('rating').notNull().default(5),
  isActive: boolean('is_active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ── Navigation Menus ───────────────────────────────────
export const navigationMenus = pgTable('navigation_menus', {
  id: uuid('id').defaultRandom().primaryKey(),
  label: text('label').notNull(),
  url: text('url').notNull(),
  parentId: uuid('parent_id'),
  location: text('location').notNull().default('header'), // 'header' or 'footer'
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
});

// ── Inventory Logs ─────────────────────────────────────
export const inventoryLogs = pgTable('inventory_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('product_id').notNull().references(() => products.id),
  variantId: uuid('variant_id').references(() => productVariants.id),
  previousStock: integer('previous_stock').notNull(),
  newStock: integer('new_stock').notNull(),
  change: integer('change').notNull(),
  reason: text('reason').notNull(),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ── Notifications ──────────────────────────────────────
export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  type: text('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  data: text('data'), // JSON
  isRead: boolean('is_read').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ── Wishlists ──────────────────────────────────────────
export const wishlists = pgTable('wishlists', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ════════════════════════════════════════════════════════
// RELATIONS
// ════════════════════════════════════════════════════════

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  reviews: many(reviews),
  notifications: many(notifications),
  wishlists: many(wishlists),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  images: many(productImages),
  variants: many(productVariants),
  reviews: many(reviews),
  wishlists: many(wishlists),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, { fields: [productImages.productId], references: [products.id] }),
}));

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, { fields: [productVariants.productId], references: [products.id] }),
  size: one(sizes, { fields: [productVariants.sizeId], references: [sizes.id] }),
  color: one(colors, { fields: [productVariants.colorId], references: [colors.id] }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  items: many(orderItems),
  payments: many(payments),
  shipments: many(shipments),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, { fields: [payments.orderId], references: [orders.id] }),
}));

export const shipmentsRelations = relations(shipments, ({ one }) => ({
  order: one(orders, { fields: [shipments.orderId], references: [orders.id] }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
  product: one(products, { fields: [reviews.productId], references: [products.id] }),
}));

export const wishlistsRelations = relations(wishlists, ({ one }) => ({
  user: one(users, { fields: [wishlists.userId], references: [users.id] }),
  product: one(products, { fields: [wishlists.productId], references: [products.id] }),
}));
