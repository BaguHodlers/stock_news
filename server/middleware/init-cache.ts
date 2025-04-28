import { defineEventHandler, getRequestURL } from "h3"
import { logger } from "#/utils/logger"
import { getCacheTable } from "#/database/cache"

// Middleware to initialize cache table on first API request
export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  if (!url.pathname.startsWith("/api")) return
  try {
    const cache = await getCacheTable()
    if (cache) {
      logger.success("Cache table initialized on first API request")
    } else {
      logger.info("Cache is disabled")
    }
  } catch (err) {
    logger.error("Failed to initialize cache table", err)
  }
})
