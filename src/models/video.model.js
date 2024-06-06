import mongoose from 'mongoose'

// Esquema para los comentarios
const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  }
}, {
  timestamps: true // Esto añade createdAt y updatedAt automáticamente
})

// Esquema para las tareas
const taskSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  score: {
    type: Number
  }
}, {
  timestamps: true // Esto añade createdAt y updatedAt automáticamente
})

// Esquema para los videos
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
  duration: {
    type: Number
  },
  likes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  task: taskSchema,
  comments: [commentSchema] // Usa el esquema de comentarios
}, {
  timestamps: true // Esto añade createdAt y updatedAt automáticamente para el video
})

export default mongoose.model('Video', videoSchema)
