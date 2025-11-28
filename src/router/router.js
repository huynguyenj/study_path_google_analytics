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
            metrics: [{ name: 'sessions' }, { name: 'activeUsers' }, { name: 'eventCount'}]
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

Router.get('/v1/google-analytics/new-user/yearly', async (req, res, next) => {
   const googleAuth = await GoogleAuthClient().getClient()
   const { year } = req.query
   const response = await redisSetOrGet(`/v1/google-analytics/new-user/yearly?year=${year}`, async () => {
      const response = await AnalyticsData.properties.runReport({
         auth: googleAuth,
         property: `properties/${envVariable.PROPERTY_ID}`,
         requestBody: {
            dateRanges: [{ startDate: `${year}-01-01`, endDate: `${year}-12-30` }],
            dimensions: [{ name: 'month' }],
            metrics: [{ name: 'newUsers' }]
         }
      })
      return response.data
   })

   const rows = response.rows || []
   const dataResponse = rows.map(row => ({
      month: parseInt(row.dimensionValues[0].value),
      newUsers: parseInt(row.metricValues[0].value)
   }))

   const fullDataMonth = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1
      const exist = dataResponse.find(d => d.month === month)
      return {
         month,
         newUser: exist ? exist.newUsers : 0
      }
   })

   return res.status(200).json({
      success: true,
      message: 'Get analytics new users in year success',
      data: fullDataMonth
   })
})

export const RouteIndex = Router