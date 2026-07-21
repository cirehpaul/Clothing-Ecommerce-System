import { Redis } from '@upstash/redis'

export default async function handler(req: any, res: any) {
  // Use Vercel's KV environment variables
  const redis = new Redis({
    url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '',
    token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '',
  })

  if (req.method === 'GET') {
    const { key } = req.query
    if (!key) return res.status(400).json({ error: 'Key is required' })
    const data = await redis.get(key as string)
    return res.status(200).json(data || null)
  }
  
  if (req.method === 'POST') {
    const { key, value } = req.body
    if (!key) return res.status(400).json({ error: 'Key is required' })
    await redis.set(key, value)
    return res.status(200).json({ success: true })
  }
  
  return res.status(405).json({ error: 'Method Not Allowed' })
}
