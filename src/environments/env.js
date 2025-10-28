import 'dotenv/config'
export const envVariable = {
  CREDENTIAL_PATH: process.env.CREDENTIAL_PATH,
  CREDENTIAL_KEY: process.env.CREDENTIAL_KEY,
  PROPERTY_ID: process.env.PROPERTY_ID,
  PORT: process.env.PORT,
  REDIS_USERNAME: process.env.REDIS_USERNAME,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT
}