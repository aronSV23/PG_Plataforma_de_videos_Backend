// libs/ffmpeg.js
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs/promises'
import path from 'path'

// Generar thumbnail y obtener duración del video
export const processVideo = async (videoPath, thumbnailPath) => {
  try {
    await fs.access(videoPath) // Verifica si el archivo existe

    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .screenshots({
          timestamps: ['50%'],
          filename: path.basename(thumbnailPath),
          folder: path.dirname(thumbnailPath),
          size: '320x240'
        })
        .ffprobe((err, metadata) => {
          if (err) {
            return reject(err)
          }
          const duration = metadata.format.duration
          resolve({ duration })
        })
    })
  } catch (err) {
    throw new Error('File not found or inaccessible, try again')
  }
}

/*
export const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0')
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toFixed(2).toString().padStart(5, '0')
  return `${h}:${m}:${s}`
} */
