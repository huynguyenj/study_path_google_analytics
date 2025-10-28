import { google } from 'googleapis'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { envVariable } from '../environments/env.js'

// Get current directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Resolve credentials path
const keyPath = path.resolve(envVariable.CREDENTIAL_PATH || path.join(__dirname, '../../analytics-key.json'))

// Validate path
if (!fs.existsSync(keyPath)) {
  console.error(`Google Analytics key not found at: ${keyPath}`)
  process.exit(1)
}

// Load credentials once
const credentials = JSON.parse(fs.readFileSync(keyPath, 'utf-8'))

// Create global GoogleAuth client
export const GoogleAuthClient = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/analytics.readonly']
})

// Create reusable AnalyticsData client
export const AnalyticsData = google.analyticsdata('v1beta')
