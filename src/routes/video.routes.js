import express from 'express'
import { createVideo, deleteVideo, getAllUserVideos, getThumbnail, getVideoDataById, updateVideo, updateVideoData, watchVideo } from '../controllers/video.controller.js'
import { auth } from '../middlewares/auth.middleware.js'
import { handleErrorThumbnail, uploadThumbnail } from '../middlewares/thumbnailMulter.middleware.js'
import { handleErrorVideo, uploadVideo } from '../middlewares/videoMulter.middleware.js'

const router = express.Router()

router.post('/', auth, uploadVideo.single('video'), handleErrorVideo, createVideo)

router.get('/', auth, getAllUserVideos)

router.get('/:videoId', auth, getVideoDataById)

router.get('/watch/:videoId', watchVideo)

router.get('/thumbnail/:videoId', getThumbnail)

router.patch('/:videoId', auth, uploadVideo.single('video'), handleErrorVideo, updateVideo)

router.patch('/data/:videoId', auth, uploadThumbnail.single('thumbnail'), handleErrorThumbnail, updateVideoData)

router.delete('/:videoId', auth, deleteVideo)

export default router
