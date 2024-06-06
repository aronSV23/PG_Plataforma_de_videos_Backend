import User from '../models/user.model.js'

export const isATeacher = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)

    if (user.role !== 'teacher') {
      return res.status(401).json({ message: 'Invalid credentials, authorization denied' })
    }

    next()
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
