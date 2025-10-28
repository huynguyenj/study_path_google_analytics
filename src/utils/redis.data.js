import { CLOSE_REDIS_CLIENT, CONNECT_REDIS, GET_REDIS_CLIENT } from "../config/redis.config.js"

export const redisSetOrGet= async (key, callback) => {
  try {
   await CONNECT_REDIS()
   const redisClient = GET_REDIS_CLIENT()
   //Get data from cache
   const data = await redisClient.get(key)
   if (data!=null) {
      // console.log('Cache hit for key:', key)
      await CLOSE_REDIS_CLIENT()
      return JSON.parse(data)
   }
    // console.log('Cache miss for key:', key)
   //Run callback if data not existed in cache
   const dataFromCallback = await callback()
   redisClient.setEx(key, 50, JSON.stringify(dataFromCallback))
   await CLOSE_REDIS_CLIENT()
   return dataFromCallback
  } catch (error) {
    console.error('Redis error:', error)
    return await callback()
  }
  
}