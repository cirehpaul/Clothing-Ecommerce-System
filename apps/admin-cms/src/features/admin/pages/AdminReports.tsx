import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'
import api from '@/lib/api'
import { formatPrice } from '@/lib/utils'

export default function AdminReports() {
  const [period, setPeriod] = useState('daily')

  const { data: salesData, isLoading: salesLoading } = useQuery({
    queryKey: ['admin-sales-report', period],
    queryFn: async () => {
      const { data } = await api.get(`/admin/reports/sales?period=${period}`)
      return data.data
    },
  })

  const { data: topProducts, isLoading: topLoading } = useQuery({
    queryKey: ['admin-top-products'],
    queryFn: async () => {
      const { data } = await api.get('/admin/reports/top-products?limit=10')
      return data.data
    },
  })

  const chartData = salesData?.map((d: any) => ({
    period: d.period,
    orders: d.totalOrders,
    revenue: parseFloat(d.totalRevenue),
  })) || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black" style={{ fontFamily: 'var(--font-display)' }}>Reports & Analytics</h1>
        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Sales performance and insights</p>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2">
        {[
          { value: 'daily', label: 'Daily' },
          { value: 'monthly', label: 'Monthly' },
          { value: 'yearly', label: 'Yearly' },
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setPeriod(value)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: period === value ? 'var(--text-primary)' : 'var(--bg-tertiary)',
              color: period === value ? 'var(--bg)' : 'var(--text-secondary)',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Sales Chart */}
      <div className="card p-6">
        <h3 className="font-bold mb-6">Revenue Over Time</h3>
        {salesLoading ? (
          <div className="h-64 skeleton rounded-xl" />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#111111" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#111111" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="period" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }}
                formatter={(v: any) => [`₱${Number(v).toLocaleString()}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#111111" strokeWidth={2.5} fill="url(#revGrad)" dot={{ r: 3, fill: '#111111' }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Orders Chart */}
      <div className="card p-6">
        <h3 className="font-bold mb-6">Orders Volume</h3>
        {salesLoading ? (
          <div className="h-48 skeleton rounded-xl" />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="period" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }}
              />
              <Bar dataKey="orders" fill="var(--text-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Top Products */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b font-bold" style={{ borderColor: 'var(--border)' }}>Top Selling Products</div>
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Units Sold</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {topLoading && Array(5).fill(0).map((_, i) => (
              <tr key={i}>{Array(4).fill(0).map((_, j) => <td key={j}><div className="skeleton h-4 w-full rounded" /></td>)}</tr>
            ))}
            {topProducts?.map((p: any, i: number) => (
              <tr key={p.productId}>
                <td>
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: i < 3 ? 'var(--text-primary)' : 'var(--bg-tertiary)', color: i < 3 ? 'var(--bg)' : 'var(--text-secondary)' }}>
                    {i + 1}
                  </span>
                </td>
                <td><span className="font-semibold text-sm">{p.productName}</span></td>
                <td><span className="text-sm">{p.totalQuantity} units</span></td>
                <td><span className="font-bold">{formatPrice(p.totalRevenue)}</span></td>
              </tr>
            ))}
            {!topLoading && (!topProducts || topProducts.length === 0) && (
              <tr><td colSpan={4} className="text-center py-10" style={{ color: 'var(--text-tertiary)' }}>No sales data yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
