import { Router } from 'express'
import { getVideos } from '../controllers/video.controller.js'
import { authRequired } from '../middlewares/validateToken.js'

const router = Router()

router.get('/tasks', authRequired, getVideos)

export default router
