const redis = require('redis')
const logger = require('../config/logger');
let isRedisSyncInProgress = false

class Redis {
  constructor(config) {
    this.redisInstance = redis.createClient(config)
  }

  async Connect () {
    await this.redisInstance.connect()
  }

  async Set (key, value) {
    await this.redisInstance.set(key, value)
    return true
  }

  async Get (key) {
    return await this.redisInstance.get(key)
  }

  async StartCacheService () {
    try {
      logger.info('INFO: START: StartCacheService :: ' + new Date().toLocaleString())
      isRedisSyncInProgress = true

      // Put service here

      isRedisSyncInProgress = false
      logger.info('INFO: END: StartCacheService :: ' + new Date().toLocaleString())

      setInterval(async () => {
        if (!isRedisSyncInProgress) {
          try {
            logger.info('INFO: START: StartCacheService :: ' + new Date().toLocaleString())
            isRedisSyncInProgress = true

            // Put service here

            isRedisSyncInProgress = false
            logger.info('INFO: END: StartCacheService :: ' + new Date().toLocaleString())
          } catch (e) {
            isRedisSyncInProgress = false
            logger.error('StartCacheService: ' + e)
          }
        }
      }, 60 * 1000)
    } catch (e) {
      logger.error('StartCacheService: ' + e)
    }
  }

  async Disconnect () {
    await this.redisInstance.disconnect()
    return true
  }

  async Destroy () {
    this.redisInstance = null
  }
}

module.exports = {
  Redis
}
