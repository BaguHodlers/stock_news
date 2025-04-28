import { SCHEDULE_INTERVAL, scheduleFetchAll } from "#/utils/scheduler"
import { logger } from "#/utils/logger"

logger.success("Scheduler plugin loaded and scheduler started.")

// 立即执行一次并记录日志
logger.success("Scheduler: running initial fetch")
scheduleFetchAll()
// 定时执行
setInterval(() => {
  logger.success("Scheduler: running scheduled fetch")
  scheduleFetchAll()
}, SCHEDULE_INTERVAL)

export default () => {}
