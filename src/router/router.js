import express from 'express'
import { envVariable } from '../environments/env.js'
import { GoogleAuthClient, AnalyticsData } from '../config/google-analytics.js'
import { redisSetOrGet } from '../utils/redis.data.js'
const Router = express.Router()

Router.get('/v1/google-analytics/active-user/sessions/weekly', async (req, res, next) => {
   const googleAuth = await GoogleAuthClient().getClient()
   const data = await redisSetOrGet('/v1/google-analytics/active-user/sessions/weekly', async () => {
         const response = await AnalyticsData.properties.runReport({
            auth: googleAuth,
            property: `properties/${envVariable.PROPERTY_ID}`,
            requestBody: {
            dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'date' }],
            metrics: [{ name: 'sessions' }, { name: 'activeUsers' }]
            }
         })
         return response.data
   })
   const row = [...data.rows]
   const sortRowIncrease = row.sort((a, b) => a.dimensionValues[0].value - b.dimensionValues[0].value)
   const dataStructure = {
      data_label: [...data.metricHeaders.map((header) => header.name )],
      data: sortRowIncrease.map((data) => {
         return {
            date: data.dimensionValues[0].value,
            values: [...data.metricValues.map(({ value }) => value )]
         }
      })
   }
    return res.json({
      success: true,
      message: 'Get analytics data success',
      data: dataStructure
   })
})

export const RouteIndex = Router