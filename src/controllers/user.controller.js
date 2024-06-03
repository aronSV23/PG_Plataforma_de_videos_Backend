import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import fs from 'node:fs/promises'
import path from 'node:path'
import { TOKEN_SECRET } from '../config/config.js'
import User from '../models/user.model.js'
import { validatePartialUser, validateUser, validatelogin } from '../schemas/user.schema.js'

export const register = async (req, res) => {
  try {
    const result = validateUser(req.body)

    if (!result.success) {
      const errorMessages = result.error.issues.map(err => ({ path: err.path[0], message: err.message }))
      return res.status(400).json({ errors: errorMessages })
    }

    const userFoundByEmail = await User.findOne({ email: result.data.email })
    const userFoundByUserName = await User.findOne({ username: result.data.username })

    if (userFoundByEmail) { return res.status(400).json({ errors: [{ path: 'email', message: 'The email is already in use' }] }) }
    if (userFoundByUserName) { return res.status(400).json({ errors: [{ path: 'username', message: 'The username is already in use' }] }) }

    result.data.password = await bcrypt.hash(result.data.password, 10)

    const newUser = new User({
      ...result.data
    })

    const userSaved = await newUser.save()
    const token = jwt.sign({ id: userSaved._id }, TOKEN_SECRET, { expiresIn: '1h' })

    const userObject = userSaved.toObject()
    delete userObject.password
    delete userObject.createdAt
    delete userObject.updatedAt
    delete userObject.__v

    res.cookie('token', token)
    return res.status(201).json({ message: 'Registered user successfully', data: userObject })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const result = validatelogin(req.body)

    if (!result.success) {
      const errorMessages = result.error.issues.map(err => ({ path: err.path[0], message: err.message }))
      return res.status(400).json({ errors: errorMessages })
    }

    const userFound = await User.findOne({ email: result.data.email }).lean()
    if (!userFound) return res.status(400).json({ errors: [{ path: 'email', message: 'The email does not exist' }] })

    const isMatch = await bcrypt.compare(result.data.password, userFound.password)
    if (!isMatch) return res.status(400).json({ errors: [{ path: 'password', message: 'The password is incorrect' }] })

    const token = jwt.sign({ id: userFound._id }, TOKEN_SECRET, { expiresIn: '1h' })

    delete userFound.password
    delete userFound.createdAt
    delete userFound.updatedAt
    delete userFound.__v

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000 // 1 hora
    })
    return res.status(201).json({ message: 'successfully logged in', data: userFound })
  } catch (error) {
    return res.status(500).json({ message: 'Error logging', error: error.message })
  }
}

export const logout = (req, res) => {
  res.cookie('token', '', {
    expires: new Date(0)
  })
  return res.sendStatus(200)
}

export const profile = async (req, res) => {
  try {
    const userFound = await User.findById(req.user.id).lean()

    if (!userFound) { return res.status(400).json({ message: 'user not found' }) }

    delete userFound.password
    delete userFound.createdAt
    delete userFound.updatedAt
    delete userFound.__v

    return res.status(201).json({ data: userFound })
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message })
  }
}

export const getProfilePicture = async (req, res) => {
  try {
    const { filename } = req.params
    const absolutePath = path.resolve(path.normalize(`./uploads/profilePictures/${filename}`))

    await fs.access(absolutePath, fs.constants.F_OK)
    return res.sendFile(absolutePath)
  } catch (error) {
    return res.status(404).json({ message: 'Imagen no encontrada' })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const result = validatePartialUser(req.body)
    const userId = req.user.id

    const prevUserData = await User.findById(userId)

    if (!result.success) {
      const errorMessages = result.error.issues.map(err => ({ path: err.path[0], message: err.message }))
      if (req.file) await fs.unlink(path.normalize(`uploads/profilePicture/${req.file.filename}`))
      return res.status(400).json({ errors: errorMessages })
    }

    const userFoundByEmail = await User.findOne({ email: result.data.email })
    if (userFoundByEmail && prevUserData.email !== result.data.email) {
      if (req.file) await fs.unlink(path.normalize(`uploads/profilePicture/${req.file.filename}`))
      return res.status(400).json({ errors: [{ path: 'email', message: 'The email is already in use' }] })
    }

    const userFoundByUserName = await User.findOne({ username: result.data.username })
    if (userFoundByUserName && prevUserData.username !== result.data.username) {
      if (req.file) await fs.unlink(path.normalize(`uploads/profilePicture/${req.file.filename}`))
      return res.status(400).json({ errors: [{ path: 'username', message: 'The username is already in use' }] })
    }

    if (result.data.password) {
      result.data.password = await bcrypt.hash(result.data.password, 10)
    }

    if (req.file) {
      result.data.profilePicture = req.file.filename
    }

    const userUpdate = await User.findByIdAndUpdate(userId, result.data, { new: true })

    if (!userUpdate) {
      if (req.file) await fs.unlink(path.normalize(`uploads/profilePicture/${req.file.filename}`))
      return res.status(404).json({ message: 'Error updating user in the database' })
    }

    if (req.file && prevUserData.profilePicture !== 'defaultProfilePicture.jpg') {
      await fs.unlink(path.normalize(`uploads/profilePicture/${prevUserData.profilePicture}`))
    }

    const userObject = userUpdate.toObject()
    delete userObject.password
    delete userObject.createdAt
    delete userObject.updatedAt
    delete userObject.__v

    return res.status(200).json({ message: 'User updated successfully', data: userObject })
  } catch (error) {
    if (req.file) await fs.unlink(path.normalize(`uploads/profilePicture/${req.file.filename}`))
    res.status(500).json({ message: 'Error updating user', error })
  }
}
