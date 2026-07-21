import { MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_ORDERS, MOCK_STATS } from './mockData';
import { useAuthStore } from '@/stores/authStore';

const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

const getStorage = async (key: string, fallback: any) => {
  try {
    const res = await fetch(`/api/kv?key=${key}`);
    const data = await res.json();
    return data !== null ? data : fallback;
  } catch { return fallback; }
};

const setStorage = async (key: string, data: any) => {
  try {
    await fetch('/api/kv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value: data })
    });
  } catch (err) { console.error('Set KV err', err); }
};

const initStorage = async (key: string, fallbackData: any) => {
  const current = await getStorage(key, null);
  if (!current) {
    await setStorage(key, fallbackData);
    return fallbackData;
  }
  return current;
};

class MockApi {
  private async ensureInit() {
    if ((window as any)._kvInitialized) return;
    await Promise.all([
      initStorage('jonel_products', MOCK_PRODUCTS),
      initStorage('jonel_categories', MOCK_CATEGORIES),
      initStorage('jonel_orders', MOCK_ORDERS),
      initStorage('jonel_banners', [
        { id: 'b1', title: 'Summer Collection 2024', subtitle: 'Discover the latest trends', imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80', linkUrl: '/products', buttonText: 'Shop Now', type: 'hero', sortOrder: 0, isActive: true },
        { id: 'b2', title: 'Flash Sale — 50% OFF', subtitle: 'Limited time only', imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80', linkUrl: '/products', buttonText: 'Grab Deals', type: 'promotional', sortOrder: 1, isActive: true },
      ]),
      initStorage('jonel_announcements', [
        { id: 'a1', message: '🔥 Free shipping on all orders over ₱3,000!', isActive: true, bgColor: '#111111', textColor: '#FFFFFF', sortOrder: 0 },
      ]),
      initStorage('jonel_pages', [
        { id: 'pg1', title: 'About Us', slug: 'about-us', content: '<h2>About JŌNEL Clothing</h2><p>We are a premium minimalist streetwear brand based in the Philippines.</p>', isPublished: true },
        { id: 'pg2', title: 'Privacy Policy', slug: 'privacy-policy', content: '<h2>Privacy Policy</h2><p>Your privacy is important to us.</p>', isPublished: true },
        { id: 'pg3', title: 'Terms & Conditions', slug: 'terms-and-conditions', content: '<h2>Terms & Conditions</h2><p>By using this website, you agree to our terms.</p>', isPublished: true },
        { id: 'pg4', title: 'Return Policy', slug: 'return-policy', content: '<h2>Return & Refund Policy</h2><p>We accept returns within 7 days of delivery.</p>', isPublished: true },
        { id: 'pg5', title: 'FAQ', slug: 'faq', content: '<h2>Frequently Asked Questions</h2><p>Q: How long is shipping? A: 3-5 business days.</p>', isPublished: true },
      ]),
      initStorage('jonel_settings', {
        storeName: 'JŌNEL Clothing',
        storeDescription: 'Premium minimalist streetwear from the Philippines.',
        supportEmail: 'support@jonel.com',
        phone: '+63 912 345 6789',
        address: 'Manila, Philippines',
        logoUrl: '',
        faviconUrl: '',
        socialLinks: { facebook: '', instagram: '', tiktok: '' },
        footerText: '© 2024 JŌNEL Clothing. All rights reserved.',
        shippingInfo: 'Free shipping on orders over ₱3,000. Standard delivery 3-5 business days.',
      }),
      initStorage('jonel_testimonials', [
        { id: 't1', name: 'Maria Santos', content: 'Amazing quality! The fabric feels premium.', rating: 5, isActive: true, sortOrder: 0 },
      ]),
      initStorage('jonel_homepage_sections', [
        { id: 'hs1', title: 'Featured Products', type: 'featured', sortOrder: 0, isActive: true },
        { id: 'hs2', title: 'New Arrivals', type: 'new_arrivals', sortOrder: 1, isActive: true },
        { id: 'hs3', title: 'Best Sellers', type: 'best_sellers', sortOrder: 2, isActive: true },
        { id: 'hs4', title: 'Categories', type: 'categories', sortOrder: 3, isActive: true },
      ]),
      initStorage('jonel_coupons', [
        { id: 'c1', code: 'WELCOME10', description: '10% off first order', type: 'percentage', value: '10', minPurchase: '500', maxDiscount: '200', usageLimit: 100, usedCount: 23, isActive: true },
      ])
    ]);
    (window as any)._kvInitialized = true;
  }

  private async handleGet(url: string) {
    await this.ensureInit();
    await delay();

    if (url === '/auth/me') {
      const token = useAuthStore.getState().token;
      if (token === 'mock-admin-token') {
        return { data: { data: { user: { id: '1', email: 'admin@jonel.com', role: 'admin', firstName: 'Admin', lastName: 'Jonel' } } } };
      }
      throw { response: { status: 401, data: { error: 'Unauthorized' } } };
    }

    if (url === '/admin/dashboard') return { data: { data: MOCK_STATS } };

    if (url.startsWith('/products') || url.startsWith('/admin/products')) {
      const products = await getStorage('jonel_products', []);
      if (url.includes('/featured')) return { data: { data: products.filter((p: any) => p.isFeatured) } };
      if (url.includes('/new-arrivals')) return { data: { data: products.filter((p: any) => p.isNewArrival) } };
      if (url.includes('/best-sellers')) return { data: { data: products.filter((p: any) => p.isBestSeller) } };

      const slugMatch = url.match(/\/products\/([a-zA-Z0-9_-]+)$/);
      if (slugMatch && !url.includes('?')) {
        const product = products.find((p: any) => p.slug === slugMatch[1] || p.id === slugMatch[1]);
        if (product) return { data: { data: product } };
      }
      return { data: { data: products, meta: { total: products.length, page: 1, limit: 20 } } };
    }

    if (url.startsWith('/categories')) return { data: { data: await getStorage('jonel_categories', []) } };
    if (url.startsWith('/admin/orders')) return { data: { data: await getStorage('jonel_orders', []) } };
    
    if (url.startsWith('/admin/customers')) return { data: { data: [
      { id: '1', firstName: 'Maria', lastName: 'Santos', email: 'maria@example.com', createdAt: new Date().toISOString(), orders: 2 },
      { id: '2', firstName: 'Juan', lastName: 'Dela Cruz', email: 'juan@example.com', createdAt: new Date().toISOString(), orders: 1 },
    ]}};

    if (url.startsWith('/admin/reports/sales')) return { data: { data: MOCK_STATS.salesChart } };
    
    if (url.startsWith('/admin/reports/top-products')) {
      const p = await getStorage('jonel_products', []);
      return { data: { data: p.slice(0, 5).map((p: any) => ({ ...p, sold: Math.floor(Math.random() * 100) })) } };
    }

    if (url.startsWith('/admin/inventory')) {
      const p = await getStorage('jonel_products', []);
      return { data: { data: p.map((p: any) => ({ id: p.id, name: p.name, sku: p.sku, totalStock: p.totalStock || 50, lowStockThreshold: 10 })) } };
    }

    if (url.startsWith('/admin/payments')) return { data: { data: [] } };
    if (url.startsWith('/admin/coupons')) return { data: { data: await getStorage('jonel_coupons', []) } };
    if (url.startsWith('/notifications')) return { data: { data: [], unreadCount: 0 } };
    if (url.startsWith('/admin/banners') || url.startsWith('/store/banners')) return { data: { data: await getStorage('jonel_banners', []) } };
    if (url.startsWith('/admin/announcements') || url.startsWith('/store/announcements')) return { data: { data: await getStorage('jonel_announcements', []) } };
    if (url.startsWith('/admin/pages') || url.startsWith('/store/pages')) return { data: { data: await getStorage('jonel_pages', []) } };
    if (url.startsWith('/admin/settings') || url.startsWith('/store/settings')) return { data: { data: await getStorage('jonel_settings', {}) } };

    if (url.startsWith('/store/homepage')) {
      const products = await getStorage('jonel_products', []);
      const sections = await getStorage('jonel_homepage_sections', []);
      const banners = await getStorage('jonel_banners', []);
      const announcements = await getStorage('jonel_announcements', []);
      const cats = await getStorage('jonel_categories', []);
      return { data: { data: {
        banners: banners.filter((b: any) => b.isActive),
        announcements: announcements.filter((a: any) => a.isActive),
        sections: sections.filter((s: any) => s.isActive).map((s: any) => {
          let items: any[] = [];
          if (s.type === 'featured') items = products.filter((p: any) => p.isFeatured);
          if (s.type === 'new_arrivals') items = products.filter((p: any) => p.isNewArrival);
          if (s.type === 'best_sellers') items = products.filter((p: any) => p.isBestSeller);
          if (s.type === 'categories') items = cats;
          return { ...s, items };
        }),
      }}};
    }
    return { data: { data: [] } };
  }

  private async handlePost(url: string, body: any) {
    await this.ensureInit();
    await delay();

    if (url === '/auth/login') {
      if (body.email === 'admin@jonel.com' && body.password === 'admin123') {
        return { data: { data: { token: 'mock-admin-token', user: { id: '1', email: 'admin@jonel.com', firstName: 'Admin', lastName: 'Jonel', role: 'admin' } } } };
      }
      throw { response: { data: { error: 'Invalid credentials' } } };
    }

    if (url === '/admin/products' || url === '/products') {
      const products = await getStorage('jonel_products', []);
      const newProduct = { ...body, id: `p_${Date.now()}`, slug: body.name?.toLowerCase().replace(/\s+/g, '-') || `product-${Date.now()}`, createdAt: new Date().toISOString(), totalStock: body.totalStock || 50, totalReviews: 0, averageRating: '0', images: body.images || [] };
      products.push(newProduct);
      await setStorage('jonel_products', products);
      return { data: { data: newProduct } };
    }

    if (url.startsWith('/admin/categories') || url.startsWith('/categories')) {
      const categories = await getStorage('jonel_categories', []);
      const newCat = { ...body, id: `cat_${Date.now()}`, slug: body.name?.toLowerCase().replace(/\s+/g, '-') || `cat-${Date.now()}` };
      categories.push(newCat);
      await setStorage('jonel_categories', categories);
      return { data: { data: newCat } };
    }

    if (url.startsWith('/admin/banners')) {
      const items = await getStorage('jonel_banners', []);
      const newItem = { ...body, id: `b_${Date.now()}` };
      items.push(newItem);
      await setStorage('jonel_banners', items);
      return { data: { data: newItem } };
    }

    if (url.startsWith('/admin/announcements')) {
      const items = await getStorage('jonel_announcements', []);
      const newItem = { ...body, id: `a_${Date.now()}` };
      items.push(newItem);
      await setStorage('jonel_announcements', items);
      return { data: { data: newItem } };
    }

    if (url.startsWith('/admin/coupons')) {
      const items = await getStorage('jonel_coupons', []);
      const newItem = { ...body, id: `c_${Date.now()}`, usedCount: 0 };
      items.push(newItem);
      await setStorage('jonel_coupons', items);
      return { data: { data: newItem } };
    }

    if (url === '/auth/logout') return { data: { success: true } };

    return { data: {} };
  }

  private async handlePut(url: string, body: any) {
    await this.ensureInit();
    await delay();
    
    const collections: Record<string, string> = {
      '/admin/products/': 'jonel_products',
      '/admin/categories/': 'jonel_categories',
      '/admin/banners/': 'jonel_banners',
      '/admin/announcements/': 'jonel_announcements',
      '/admin/coupons/': 'jonel_coupons',
      '/admin/orders/': 'jonel_orders',
    };
    
    for (const [prefix, key] of Object.entries(collections)) {
      if (url.startsWith(prefix)) {
        const id = url.split('/').pop();
        const items = await getStorage(key, []);
        const index = items.findIndex((i: any) => i.id === id || i.id === Number(id));
        if (index > -1) {
          items[index] = { ...items[index], ...body };
          await setStorage(key, items);
          return { data: { data: items[index] } };
        }
      }
    }
    
    if (url.startsWith('/admin/settings')) {
      await setStorage('jonel_settings', body);
      return { data: { data: body } };
    }
    
    if (url.startsWith('/admin/pages/') || url.startsWith('/pages/')) {
       const id = url.split('/').pop();
       const items = await getStorage('jonel_pages', []);
       const index = items.findIndex((i: any) => i.id === id || i.id === Number(id));
       if (index > -1) {
          items[index] = { ...items[index], ...body };
          await setStorage('jonel_pages', items);
          return { data: { data: items[index] } };
       }
    }

    return { data: {} };
  }

  private async handleDelete(url: string) {
    await this.ensureInit();
    await delay();
    
    const collections: Record<string, string> = {
      '/admin/products/': 'jonel_products',
      '/admin/categories/': 'jonel_categories',
      '/admin/banners/': 'jonel_banners',
      '/admin/announcements/': 'jonel_announcements',
      '/admin/coupons/': 'jonel_coupons',
    };
    
    for (const [prefix, key] of Object.entries(collections)) {
      if (url.startsWith(prefix)) {
        const id = url.split('/').pop();
        let items = await getStorage(key, []);
        items = items.filter((i: any) => i.id !== id && String(i.id) !== id);
        await setStorage(key, items);
        return { data: { success: true } };
      }
    }
    return { data: {} };
  }

  public async get(url: string, _config?: any) {
    console.log(`[KV MOCK API] GET ${url}`);
    return this.handleGet(url);
  }
  public async post(url: string, data?: any, _config?: any) {
    console.log(`[KV MOCK API] POST ${url}`, data);
    return this.handlePost(url, data);
  }
  public async put(url: string, data?: any, _config?: any) {
    console.log(`[KV MOCK API] PUT ${url}`);
    return this.handlePut(url, data);
  }
  public async patch(url: string, data?: any, _config?: any) {
    console.log(`[KV MOCK API] PATCH ${url}`);
    return this.handlePut(url, data);
  }
  public async delete(url: string, _config?: any) {
    console.log(`[KV MOCK API] DELETE ${url}`);
    return this.handleDelete(url);
  }
  public interceptors = {
    request: { use: () => {} },
    response: { use: () => {} }
  }
}

export const api = new MockApi();
export default api;
