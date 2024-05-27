import mongoose from 'mongoose'
import { MONGODB_URI } from './config.js'

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Conectado a la base de datos')
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}
