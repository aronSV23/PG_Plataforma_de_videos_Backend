import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import fs from 'fs'
import morgan from 'morgan'
import path from 'path'
import swaggerUi from 'swagger-ui-express'
import taskRoute from './routes/task.routes.js'
import authRoutes from './routes/user.routes.js'
import videoRoute from './routes/video.routes.js'

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())

// Cargar archivo JSON de Swagger
const pathToFile = path.resolve('./src/config/swagger/swagger-output.json')
const swaggerFile = await fs.promises.readFile(pathToFile, 'utf8').then(JSON.parse)

// Configurar Swagger UI
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use('/api/user', authRoutes)
app.use('/api/video', videoRoute)
app.use('/api/task', taskRoute)

app.use((req, res, next) => {
  res.status(404).json({ message: 'End point not found' })
})

export default app
