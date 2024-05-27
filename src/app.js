import express from 'express'

const app = express()
app.use(express.json())

app.use((req, res, next) => {
  res.status(404).json({ message: 'End point not found' })
})

export default app
