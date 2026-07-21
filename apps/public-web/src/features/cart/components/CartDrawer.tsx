import { AnimatePresence, motion } from 'framer-motion'
import { X, ShoppingBag, Minus, Plus, Trash2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useUIStore } from '@/stores/uiStore'
import { useCart, useUpdateCartItem, useRemoveCartItem } from '@/features/cart/hooks/useCart'
import { formatPrice, getDiscountedPrice } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'

export default function CartDrawer() {
  const { isCartOpen, closeCart } = useUIStore()
  const { isAuthenticated } = useAuthStore()
  const { data: cart } = useCart()
  const updateItem = useUpdateCartItem()
  const removeItem = useRemoveCartItem()

  const items = cart?.items || []
  const total = cart?.total || '0'

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{ background: 'var(--overlay)' }}
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="fixed right-0 top-0 bottom-0 z-[60] w-full max-w-md flex flex-col"
            style={{ background: 'var(--bg)', boxShadow: '-4px 0 30px rgb(0 0 0 / 0.12)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} />
                <h2 className="font-bold text-lg">Your Cart</h2>
                {items.length > 0 && (
                  <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
                    style={{ background: 'var(--text-primary)', color: 'var(--bg)' }}>
                    {cart?.itemCount}
                  </span>
                )}
              </div>
              <button onClick={closeCart} className="btn btn-ghost p-2 rounded-lg">
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5">
              {!isAuthenticated ? (
                <div className="text-center py-16">
                  <ShoppingBag size={48} className="mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
                  <p className="font-semibold mb-2">Sign in to view your cart</p>
                  <p className="text-sm mb-6" style={{ color: 'var(--text-tertiary)' }}>
                    Login to access your cart and start shopping.
                  </p>
                  <Link to="/login" onClick={closeCart} className="btn btn-primary">
                    Sign In
                  </Link>
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBag size={48} className="mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
                  <p className="font-semibold mb-2">Your cart is empty</p>
                  <p className="text-sm mb-6" style={{ color: 'var(--text-tertiary)' }}>
                    Add some products to get started.
                  </p>
                  <Link to="/products" onClick={closeCart} className="btn btn-primary">
                    Shop Now
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => {
                    const price = getDiscountedPrice(item.product.price, item.product.salePrice)
                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex gap-4 p-4 rounded-xl"
                        style={{ background: 'var(--bg-secondary)' }}
                      >
                        {/* Image */}
                        <Link to={`/products/${item.product.slug}`} onClick={closeCart}>
                          <div className="w-20 h-24 rounded-lg overflow-hidden flex-shrink-0"
                            style={{ background: 'var(--bg-tertiary)' }}>
                            {item.product.image && (
                              <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                            )}
                          </div>
                        </Link>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <Link to={`/products/${item.product.slug}`} onClick={closeCart}>
                            <h4 className="text-sm font-semibold line-clamp-2 mb-1 hover:underline" style={{ color: 'var(--text-primary)' }}>
                              {item.product.name}
                            </h4>
                          </Link>
                          <p className="text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>
                            {item.variant.color.name} / {item.variant.size.name}
                          </p>

                          <div className="flex items-center justify-between">
                            {/* Qty control */}
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => updateItem.mutate({ id: item.id, quantity: item.quantity - 1 })}
                                disabled={item.quantity <= 1 || updateItem.isPending}
                                className="qty-btn"
                                style={{ width: '1.75rem', height: '1.75rem' }}
                              >
                                <Minus size={11} />
                              </button>
                              <span className="w-7 text-center text-sm font-semibold">{item.quantity}</span>
                              <button
                                onClick={() => updateItem.mutate({ id: item.id, quantity: item.quantity + 1 })}
                                disabled={item.quantity >= item.variant.stock}
                                className="qty-btn"
                                style={{ width: '1.75rem', height: '1.75rem' }}
                              >
                                <Plus size={11} />
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold">{formatPrice(price * item.quantity)}</span>
                              <button
                                onClick={() => removeItem.mutate(item.id)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--danger-light)]"
                                style={{ color: 'var(--text-tertiary)' }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {isAuthenticated && items.length > 0 && (
              <div className="p-5 border-t" style={{ borderColor: 'var(--border)' }}>
                {/* Subtotal */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                  <span className="text-lg font-black">{formatPrice(parseFloat(total))}</span>
                </div>
                <p className="text-xs mb-4 text-center" style={{ color: 'var(--text-tertiary)' }}>
                  Shipping and taxes calculated at checkout
                </p>
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="btn btn-primary btn-lg w-full justify-center gap-2"
                >
                  Checkout <ArrowRight size={16} />
                </Link>
                <Link
                  to="/products"
                  onClick={closeCart}
                  className="btn btn-ghost btn-sm w-full justify-center mt-2"
                >
                  Continue Shopping
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
