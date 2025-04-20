import type { SourceID } from "@shared/types"
import type { H3Event } from "h3"
import { defineEventHandler, readBody } from "h3"
import { z } from "zod"
import { sources } from "@shared/sources"
import { getCacheTable } from "#/database/cache"

// 参数验证schema
const querySchema = z.object({
  minutes: z.number().min(1).max(1440).default(5), // 最多24小时
  sourceIds: z.array(z.string()).optional(), // 可选的新闻源过滤
})

export default defineEventHandler(async (event: H3Event) => {
  try {
    const query = await readBody(event)
    const { minutes, sourceIds } = querySchema.parse(query)

    const now = Date.now()
    const startTime = now - minutes * 60 * 1000

    const cacheTable = await getCacheTable()
    if (!cacheTable) {
      throw new Error("Cache table not initialized")
    }

    const targetSourceIds = (sourceIds?.filter(id => id in sources) as SourceID[]) || (Object.keys(sources) as SourceID[])

    const caches = await cacheTable.getEntire(targetSourceIds)

    const newsItems = caches.flatMap(cache => cache.items
      .filter((item) => {
        const pubDate = typeof item.pubDate === "string"
          ? new Date(item.pubDate).getTime()
          : Number(item.pubDate)
        return pubDate >= startTime && pubDate <= now
      })
      .map(item => ({
        ...item,
        source: cache.id,
        cacheTime: cache.updated,
      })),
    )

    const sortedNews = newsItems.sort((a, b) => {
      const dateA = typeof a.pubDate === "string" ? new Date(a.pubDate).getTime() : Number(a.pubDate)
      const dateB = typeof b.pubDate === "string" ? new Date(b.pubDate).getTime() : Number(b.pubDate)
      return dateB - dateA
    })

    return {
      status: "success",
      data: {
        total: sortedNews.length,
        startTime,
        endTime: now,
        items: sortedNews,
      },
    }
  } catch (error) {
    console.error("Error in /api/news/history:", error)
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
})
