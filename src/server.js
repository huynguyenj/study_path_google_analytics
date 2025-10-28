import express from 'express'
import { envVariable } from './environments/env.js'
import cors from 'cors'
import { RouteIndex } from './router/router.js'
import { errorHandle } from './middlewares/errorhandle.js'
// export const START_SERVER = () => {
//   const PORT = envVariable.PORT ?? 3000
//   const app = express()
//   app.use(express.json())
//   app.use(cors())
//   app.use('/analytics',RouteIndex)
//   app.use(errorHandle)
//   app.listen(PORT, () => {
//       console.log(`Server connect to port ${PORT}`);
//   })

// }

// START_SERVER()

//Set up vercel functional
const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.json({ message: 'Analytics API is running on Vercel!' })
})
app.use(errorHandle)
app.use('/analytics', RouteIndex)

export default app