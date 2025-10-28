import express from 'express'
import { envVariable } from '../environments/env.js'
import { GoogleAuthClient, AnalyticsData } from '../config/google-analytics.js'
const Router = express.Router()

Router.get('/v1/google-analytics/active-user/sessions/weekly', async (req, res) => {
   const googleAuth = await GoogleAuthClient.getClient()
   try {
      const response = await AnalyticsData.properties.runReport({
      auth: googleAuth,
      property: `properties/${envVariable.PROPERTY_ID}`,
      requestBody: {
         dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
         dimensions: [{ name: 'date' }],
         metrics: [{ name: 'sessions' }, { name: 'activeUsers' }]
      }
   })
   const { data } = response
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

   } catch (error) {
       console.error('Google Analytics API error:', error)
    res.status(500).json({ 
      success: false,
      message: 'Get analytics data fail',
      error: error.message 
   })
   }

})

export const RouteIndex = Router