import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  TrendingUp, ShoppingBag, Users, Package, AlertTriangle,
  ArrowUp, DollarSign, Clock, CheckCircle2
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid, Legend
} from 'recharts'
import api from '@/lib/api'
import { formatPrice, formatNumber, getOrderStatusLabel, getOrderStatusColor } from '@/lib/utils'
import type { DashboardData } from '@/types'

function StatCard({ icon: Icon, title, value, sub, trend, color }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color + '20' }}>
          <Icon size={18} style={{ color }} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#16A34A' }}>
            <ArrowUp size={11} /> {trend}
          </div>
        )}
      </div>
      <p className="text-2xl font-black mb-0.5">{value}</p>
      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{title}</p>
      {sub && <p className="text-[10px] mt-1" style={{ color: 'var(--text-tertiary)' }}>{sub}</p>}
    </motion.div>
  )
}

export default function AdminDashboard() {
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/admin/dashboard')
      return data.data
    },
    refetchInterval: 60000,
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}
        </div>
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    )
  }

  const chartData = data?.salesChart?.map((d: any) => ({
    date: new Date(d.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' }),
    orders: d.orders,
    revenue: parseFloat(d.revenue),
  })) || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black" style={{ fontFamily: 'var(--font-display)' }}>Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={DollarSign}
          title="Today's Revenue"
          value={formatPrice(data?.today?.totalRevenue || 0)}
          sub={`${data?.today?.totalOrders || 0} orders`}
          color="#16A34A"
          trend="+12%"
        />
        <StatCard
          icon={TrendingUp}
          title="Monthly Revenue"
          value={formatPrice(data?.monthly?.totalRevenue || 0)}
          sub={`${data?.monthly?.totalOrders || 0} orders`}
          color="#2563EB"
          trend="+8%"
        />
        <StatCard
          icon={Package}
          title="Total Products"
          value={formatNumber(data?.totalProducts || 0)}
          color="#7C3AED"
        />
        <StatCard
          icon={Users}
          title="Customers"
          value={formatNumber(data?.totalCustomers || 0)}
          color="#EA580C"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Chart */}
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-bold mb-4 text-sm">Revenue — Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#111111" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#111111" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₱${v}`} />
              <Tooltip
                contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }}
                formatter={(val) => [`₱${Number(val).toLocaleString()}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#111111" strokeWidth={2} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Stats */}
        <div className="card p-5 space-y-4">
          <h3 className="font-bold text-sm">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
              <div className="flex items-center gap-2.5">
                <Clock size={15} style={{ color: '#EA580C' }} />
                <span className="text-sm font-medium">Pending Orders</span>
              </div>
              <span className="text-sm font-black" style={{ color: '#EA580C' }}>
                {data?.pendingOrders || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
              <div className="flex items-center gap-2.5">
                <AlertTriangle size={15} style={{ color: '#DC2626' }} />
                <span className="text-sm font-medium">Low Stock Items</span>
              </div>
              <span className="text-sm font-black" style={{ color: '#DC2626' }}>
                {data?.lowStock?.length || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={15} style={{ color: '#16A34A' }} />
                <span className="text-sm font-medium">Monthly Orders</span>
              </div>
              <span className="text-sm font-black" style={{ color: '#16A34A' }}>
                {data?.monthly?.totalOrders || 0}
              </span>
            </div>
          </div>

          {/* Low Stock */}
          {data?.lowStock && data.lowStock.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>
                Low Stock Alert
              </p>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {data.lowStock.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <span className="truncate" style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                    <span className="font-bold ml-2 flex-shrink-0" style={{ color: item.totalStock === 0 ? '#DC2626' : '#EA580C' }}>
                      {item.totalStock} left
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <h3 className="font-bold text-sm">Recent Orders</h3>
          <a href="/admin/orders" className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>View all →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentOrders?.slice(0, 8).map((order) => (
                <tr key={order.id}>
                  <td>
                    <span className="font-mono text-xs font-semibold">{order.orderNumber}</span>
                  </td>
                  <td>
                    <span className="text-sm">
                      {order.user?.firstName} {order.user?.lastName}
                    </span>
                  </td>
                  <td>
                    <span className="font-semibold">{formatPrice(order.grandTotal)}</span>
                  </td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        background: getOrderStatusColor(order.status) + '20',
                        color: getOrderStatusColor(order.status),
                      }}
                    >
                      {getOrderStatusLabel(order.status)}
                    </span>
                  </td>
                  <td>
                    <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              ))}
              {(!data?.recentOrders || data.recentOrders.length === 0) && (
                <tr>
                  <td colSpan={5} className="text-center py-8" style={{ color: 'var(--text-tertiary)' }}>
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
