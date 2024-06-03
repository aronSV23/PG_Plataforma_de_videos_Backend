import multer from 'multer'

// Configurar el almacenamiento de archivos en el servidor
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/thumbnails/')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

// Configurar la carga de archivos
export const uploadThumbnail = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limitar el tamaño de archivo a 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only images allowed'))
    }
  }
})

// Función para manejar el error
export const handleErrorThumbnail = (err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    res.status(400).json({ errors: [{ path: 'file', message: 'The file must be less than 10 MB' }] })
  } else {
    res.status(400).json({ errors: [{ path: 'file', message: 'Only images allowed' }] })
  }
}
