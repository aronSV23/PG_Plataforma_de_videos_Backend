// models/Video.js
import mongoose from 'mongoose'

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  tags: [String],
  filePath: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    default: 'defaultVideoThumbnail.png' // Ruta de la imagen thumbnail por defecto
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  views: {
    type: Number,
    default: 0
  }
},
{
  timestamps: true
}
)

export default mongoose.model('Video', videoSchema)
