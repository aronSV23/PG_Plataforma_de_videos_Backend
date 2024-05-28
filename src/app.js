import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import authRoutes from './routes/auth.routes.js'
import videoRoute from './routes/video.routes.js'

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())

app.use('/api', authRoutes)
app.use('/api', videoRoute)

app.use((req, res, next) => {
  res.status(404).json({ message: 'End point not found' })
})

export default app
