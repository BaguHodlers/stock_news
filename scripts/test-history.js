#!/usr/bin/env node

import { $fetch } from "ofetch"

const baseUrl = process.env.BASE_URL || "http://localhost:5173"
const intervalMs = 60 * 1000 // 1 minute

const seenUrls = new Set()

async function testHistory() {
  const minutes = 1
  try {
    const res = await $fetch(`${baseUrl}/api/news/history`, {
      method: "POST",
      body: { minutes },
    })
    if (res.status !== "success") {
      console.error("API returned error:", res)
      return
    }
    const items = res.data.items
    const duplicate = items.find(item => seenUrls.has(item.url))
    if (duplicate) {
      console.error("Duplicate item detected:", duplicate.url)

      process.exit(1)
    } else {
      items.forEach((item) => {
        seenUrls.add(item.url)
        console.log(`来源: ${item.channelName} | 标题: ${item.title} | URL: ${item.url}`)
      })
      console.log(`[${new Date().toISOString()}] Fetched ${items.length} items, no duplicates.`)
    }
  } catch (err) {
    console.error("Fetch error:", err)
  }
}

// Initial run and schedule
await testHistory()
setInterval(testHistory, intervalMs)
