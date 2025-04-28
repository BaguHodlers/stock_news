import Redis from "ioredis"
import type { NewsItem } from "@shared/types"
import type { CacheInfo } from "../types"
import { logger } from "#/utils/logger"

// Initialize Redis client pointing to localhost:6379 DB 1
const redisClient = new Redis({ host: "localhost", port: 6379, db: 1 })

export class Cache {
  private client: Redis
  constructor(client: Redis = redisClient) {
    this.client = client
  }

  async set(key: string, items: NewsItem[]) {
    const now = Date.now()
    await this.client.set(key, JSON.stringify({ items, updated: now }))
    logger.success(`set ${key} cache`)
  }

  async get(key: string): Promise<CacheInfo | undefined> {
    const data = await this.client.get(key)
    if (!data) return undefined
    const { items, updated } = JSON.parse(data)
    logger.success(`get ${key} cache`)
    return { id: key as any, updated, items }
  }

  async getEntire(keys: string[]): Promise<CacheInfo[]> {
    const pipeline = this.client.pipeline()
    keys.forEach(k => pipeline.get(k))
    const results = (await pipeline.exec()) || []
    const infos: CacheInfo[] = []
    results.forEach(([err, val], idx) => {
      if (err) {
        console.error("Redis pipeline error:", err)
        return
      }
      if (typeof val === "string") {
        const { items, updated } = JSON.parse(val) as { items: NewsItem[], updated: number }
        infos.push({ id: keys[idx] as any, updated, items })
      }
    })
    return infos
  }

  async delete(key: string) {
    await this.client.del(key)
    logger.success(`delete ${key} cache`)
  }
}

// Export a singleton-like function for retrieving cache instance
export function getCacheTable() {
  return new Cache()
}
