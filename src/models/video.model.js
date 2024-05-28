// models/Video.js
import mongoose from 'mongoose'

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  tags: {
    type: [String]
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  duration: {
    type: Number,
    required: true
  },
  thumbnail: {
    type: String
  },
  videoPath: {
    type: String,
    required: true
  },
  views: {
    type: Number,
    default: 0
  }
})

export default mongoose.model('Video', videoSchema)
