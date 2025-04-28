import { SCHEDULE_INTERVAL, scheduleFetchAll } from "#/utils/scheduler"
import { logger } from "#/utils/logger"

logger.info("Scheduler plugin loaded and scheduler started.")

// 立即执行一次
scheduleFetchAll()
// 定时执行
setInterval(scheduleFetchAll, SCHEDULE_INTERVAL)

export default () => {}
