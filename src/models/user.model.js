import mongoose from 'mongoose'

// Definir el esquema del usuario
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true
  },
  profilePicture: {
    type: String,
    default: 'defaultProfilePicture.jpg' // Ruta de la imagen de perfil por defecto
  },
  role: {
    type: String,
    enum: ['student', 'teacher'], // Solo se permiten estos roles
    default: 'student'
  },
  teacherAssigned: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  }
},
{
  timestamps: true
}
)

// Crear el modelo del usuario
const User = mongoose.model('User', userSchema)

export default User
