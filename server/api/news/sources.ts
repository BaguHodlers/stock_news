import { sources } from "@shared/sources"
import type { Source } from "@shared/types"

export default defineEventHandler(async () => {
  try {
    // 过滤掉被禁用的新闻源
    const availableSources = Object.entries(sources)
      .filter(([_, source]) => !source.disable)
      .reduce((acc, [id, source]) => {
        acc[id] = {
          name: source.name,
          title: source.title,
          type: source.type,
          column: source.column,
          color: source.color,
          interval: source.interval,
          home: source.home,
        }
        return acc
      }, {} as Record<string, Partial<Source>>)

    return {
      status: "success",
      data: {
        total: Object.keys(availableSources).length,
        sources: availableSources,
      },
    }
  } catch (error) {
    console.error("Error in /api/news/sources:", error)
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
})
