import fs from 'node:fs/promises'
import path from 'node:path'
import { processVideo } from '../libs/ffmpeg.js'
import Task from '../models/task.model.js'
import Video from '../models/video.model.js'
import { validatePartialVideo, validateScore, validateVideo } from '../schemas/video.schema.js'

export const createVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ errors: [{ path: 'file', message: 'video must be send' }] })
    }

    const result = validateVideo(req.body)

    if (!result.success) {
      const errorMessages = result.error.issues.map(err => ({ path: err.path[0], message: err.message }))
      if (req.file) await fs.unlink(path.normalize(`uploads/videos/${req.file.filename}`))
      return res.status(400).json({ errors: errorMessages })
    }

    if (result.data.tags) result.data.tags = result.data.tags.split(' ')
    result.data.user = req.user.id
    result.data.filePath = req.file.filename

    // Generar thumbnail y obtener duración del video
    const thumbnailPath = `uploads/thumbnails/${Date.now()}-thumbnail.png`
    const { duration } = await processVideo(req.file.path, thumbnailPath)
    result.data.thumbnail = path.basename(thumbnailPath)
    result.data.duration = duration.toFixed(3) // Agregar duración al objeto de datos

    if (result.data.task) {
      const task = await Task.findById(result.data.task)
      if (!task) {
        await fs.unlink(path.normalize(`uploads/videos/${req.file.filename}`))
        return res.status(400).json({ errors: [{ path: 'Task', message: 'The Task not found' }] })
      }
      result.data.task = {
        taskId: task._id
      }
    }

    const newVideo = new Video({
      ...result.data
    })

    const videoSaved = await newVideo.save()

    const videoData = await Video.findById(videoSaved._id).populate('user', 'username')

    const videoObject = videoData.toObject()

    return res.status(201).json({ message: 'Video saved successfully', data: videoObject })
  } catch (error) {
    if (req.file) await fs.unlink(path.normalize(`uploads/videos/${req.file.filename}`))
    res.status(500).json({ message: 'Error saving video', error: error.message })
  }
}

export const getVideoDataById = async (req, res) => {
  const { videoId } = req.params

  try {
    const video = await Video.findById(videoId).populate('user', 'username')

    if (!video) {
      return res.status(404).json({ message: 'Video not found' })
    }

    res.status(200).json(video)
  } catch (error) {
    res.status(500).json({ message: 'Error finding video', error: error.message })
  }
}

export const getVideoDataByTaskId = async (req, res) => {
  const { taskId } = req.params

  try {
    const videos = await Video.find({ 'task.taskId': taskId }).populate('user', 'username -_id')

    if (!videos || videos.length === 0) {
      return res.status(404).json({ message: 'No videos found for the specified task' })
    }

    res.status(200).json(videos)
  } catch (error) {
    res.status(500).json({ message: 'Error finding videos', error: error.message })
  }
}

export const updateTaskScoreInVideo = async (req, res) => {
  const { videoId } = req.params

  try {
    const result = validateScore(req.body)

    if (!result.success) {
      const errorMessages = result.error.issues.map(err => ({ path: err.path[0], message: err.message }))
      return res.status(400).json({ errors: errorMessages })
    }

    const video = await Video.findOneAndUpdate(
      { _id: videoId },
      { 'task.score': result.data.score },
      { new: true }
    ).populate('user', 'username -_id')

    if (!video) {
      return res.status(404).json({ message: 'Video or Task not found' })
    }

    res.status(200).json(video)
  } catch (error) {
    res.status(500).json({ message: 'Error updating task score', error: error.message })
  }
}

export const getAllUserVideos = async (req, res) => {
  try {
    const videos = await Video.find({ user: req.user.id }).populate('user', 'username -_id')
    res.status(200).json(videos)
  } catch (error) {
    res.status(500).json({ message: 'Error getting videos', error: error.message })
  }
}

export const watchVideo = async (req, res) => {
  const { videoId } = req.params

  try {
    const video = await Video.findById(videoId).populate('user')

    if (!video) {
      return res.status(404).json({ message: 'Video not found' })
    }

    const absolutePath = path.resolve(`./uploads/videos/${video.filePath}`)

    await fs.access(absolutePath, fs.constants.F_OK)

    res.status(200).sendFile(absolutePath)
  } catch (error) {
    res.status(500).json({ message: 'Error finding video', error: error.message })
  }
}

export const getThumbnail = async (req, res) => {
  const { videoId } = req.params

  try {
    const video = await Video.findById(videoId).populate('user')

    if (!video) {
      return res.status(404).json({ message: 'Video thumbnail not found' })
    }

    const absolutePath = path.resolve(`./uploads/thumbnails/${video.thumbnail}`)

    await fs.access(absolutePath, fs.constants.F_OK)

    res.status(200).sendFile(absolutePath)
  } catch (error) {
    res.status(500).json({ message: 'Error finding video thumbnail', error: error.message })
  }
}

export const updateVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ errors: [{ path: 'file', message: 'video file must be send to update' }] })
    }

    const { videoId } = req.params

    const prevVideoData = await Video.findById(videoId).populate('user', 'username -_id')

    if (!prevVideoData) {
      if (req.file) await fs.unlink(path.normalize(`uploads/videos/${req.file.filename}`))
      return res.status(404).json({ message: 'Video not found to update' })
    }

    if (req.user.id !== prevVideoData.user._id) {
      return res.status(401).json({ message: 'You are not allow to update this video, authorization denied' })
    }

    const video = await Video.findByIdAndUpdate(videoId, { filePath: req.file.filename }, { new: true }).populate('user', 'username -_id')

    if (!video) {
      if (req.file) await fs.unlink(path.normalize(`uploads/videos/${req.file.filename}`))
      return res.status(404).json({ message: 'Fail to update video' })
    }

    await fs.unlink(path.normalize(`uploads/videos/${prevVideoData.filePath}`))

    res.status(200).json({ message: 'Video updated successfully', video })
  } catch (error) {
    if (req.file) await fs.unlink(path.normalize(`uploads/videos/${req.file.filename}`))
    res.status(500).json({ message: 'Error al actualizar el video', error })
  }
}

export const updateVideoData = async (req, res) => {
  try {
    const { videoId } = req.params

    const prevVideoData = await Video.findById(videoId)

    if (!prevVideoData) {
      if (req.file) await fs.unlink(path.normalize(`uploads/thumbnails/${req.file.filename}`))
      return res.status(404).json({ message: 'Video not found to update' })
    }

    if (req.user.id !== prevVideoData.user._id) {
      return res.status(401).json({ message: 'You are not allow to update this video, authorization denied' })
    }

    const result = validatePartialVideo(req.body)

    if (!result.success) {
      const errorMessages = result.error.issues.map(err => ({ path: err.path[0], message: err.message }))
      if (req.file) await fs.unlink(path.normalize(`uploads/thumbnails/${req.file.filename}`))
      return res.status(400).json({ errors: errorMessages })
    }

    if (req.file) {
      result.data.thumbnail = req.file.filename
    }

    if (result.data.tags) result.data.tags = result.data.tags.split(' ')

    const video = await Video.findByIdAndUpdate(videoId, result.data, { new: true }).populate('user', 'username -_id')

    if (!video) {
      if (req.file) await fs.unlink(path.normalize(`uploads/thumbnails/${req.file.filename}`))
      return res.status(404).json({ message: 'Video not found to update' })
    }

    if (req.file && prevVideoData.thumbnail !== 'defaultVideoThumbnail.png') {
      await fs.unlink(path.normalize(`uploads/thumbnails/${prevVideoData.thumbnail}`))
    }

    await fs.unlink(path.normalize(`uploads/videos/${prevVideoData.filePath}`))

    res.status(200).json({ message: 'Video updated successfully', video })
  } catch (error) {
    if (req.file) await fs.unlink(path.normalize(`uploads/thumbnails/${req.file.filename}`))
    res.status(500).json({ message: 'Error al actualizar el video', error })
  }
}

export const deleteVideo = async (req, res) => {
  try {
    const { videoId } = req.params

    const prevVideoData = await Video.findById(videoId)

    if (!prevVideoData) {
      return res.status(404).json({ message: 'Video not found to delete' })
    }

    if (req.user.id !== prevVideoData.user._id) {
      return res.status(401).json({ message: 'You are not allow to delete this video, authorization denied' })
    }

    const video = await Video.findByIdAndDelete(videoId)

    if (!video) {
      return res.status(404).json({ message: 'Video no found' })
    }

    if (prevVideoData.thumbnail !== 'defaultVideoThumbnail.png') {
      await fs.unlink(path.normalize(`uploads/thumbnails/${prevVideoData.thumbnail}`))
    }

    res.status(200).json({ message: 'Video delete successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting video', error: error.message })
  }
}
