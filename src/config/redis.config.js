import { createClient } from "redis"
import { envVariable } from "../environments/env.js"
import { ApiError } from "./error.custom.js"

let redisClient = null
const client = createClient({
         username: envVariable.REDIS_USERNAME,
         password: envVariable.REDIS_PASSWORD,
         socket: {
            host: envVariable.REDIS_HOST,
            port: envVariable.REDIS_PORT
         }
})
export const CONNECT_REDIS = async () => {
   try {
      redisClient = await client.connect();
   } catch (error) {
      throw new ApiError(500, 'Connect to redis fail') 
   }
}

export const GET_REDIS_CLIENT = () => {
   return redisClient
}

export const CLOSE_REDIS_CLIENT = async () => {
   await client.close()
}