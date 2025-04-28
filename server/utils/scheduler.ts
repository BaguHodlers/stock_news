import type { SourceID } from "@shared/types"
import { sources } from "@shared/sources"
import Redis from "ioredis"
import { getters } from "#/getters"
import { getCacheTable } from "#/database/cache"
import { logger } from "#/utils/logger"

// Interval for scheduled fetch in milliseconds (e.g., 60 seconds)
const SCHEDULE_INTERVAL = process.env.SCHEDULE_INTERVAL
  ? Number(process.env.SCHEDULE_INTERVAL)
  : 60 * 1000

// 用于去重的 Redis 客户端（与 cache.ts 复用配置）
const redisClient = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  db: Number(process.env.REDIS_DB) || 1,
})

export async function scheduleFetchAll() {
  try {
    const cacheTable = await getCacheTable()
    if (!cacheTable) return
    const sourceIds = Object.keys(sources) as SourceID[]
    for (const id of sourceIds) {
      try {
        const items = await getters[id]()
        // 去重逻辑：只缓存第一次见到的新闻
        const uniqueKey = `news:seen:${id}`
        const newItems: typeof items = []
        const now = Date.now()
        for (const item of items) {
          if (!item.url) continue // 没有 url 的新闻跳过
          // sadd 返回 1 表示新加的，0 表示已存在
          const isNew = await redisClient.sadd(uniqueKey, item.url)
          if (isNew) {
            newItems.push({ ...item, pubDate: now })
            logger.info(`Channel ${id}: 新新闻 - ${item.title}`)
          }
        }
        logger.success(`Channel ${id}: fetched ${items.length} news items, new: ${newItems.length}`)
        if (newItems.length) {
          await cacheTable.set(id, newItems.slice(0, 30))
        }
      } catch (err) {
        logger.error(`Channel ${id}: fetch error`, err)
      }
    }
  } catch (err) {
    logger.error("Scheduler encountered an error:", err)
  }
}

export { SCHEDULE_INTERVAL }
