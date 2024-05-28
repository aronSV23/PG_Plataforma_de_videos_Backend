import { config } from 'dotenv'

config()

export const MONGODB_URI = process.env.MONGODB_URI || ''
export const TOKEN_SECRET = 'some secret key'
