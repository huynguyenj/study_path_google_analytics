import express from 'express'
import { envVariable } from './environments/env.js'
import cors from 'cors'
import { RouteIndex } from './router/router.js'
export const START_SERVER = () => {
  const PORT = envVariable.PORT ?? 3000
  const app = express()
  app.use(express.json())
  app.use(cors())
  app.get('/', (req, res) => {
    res.json({ message: 'Analytics API is running on Vercel!' });
  });
  app.use('/analytics',RouteIndex)
  // app.listen(PORT, () => {
  //     console.log(`Server connect to port ${PORT}`);
  // })

}

// START_SERVER()