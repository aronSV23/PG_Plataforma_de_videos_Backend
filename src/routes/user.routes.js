import { Router } from 'express'
import { getProfilePicture, login, logout, profile, register, updateProfile } from '../controllers/user.controller.js'
import { auth } from '../middlewares/auth.middleware.js'
import { handleErrorProfilePicture, uploadProfilePicture } from '../middlewares/profilePictureMulter.middleware.js'

const router = Router()

router.post('/register', register)

router.post('/login', login)

router.post('/logout', logout)

router.get('/profile', auth, profile)

router.get('/profilePicture/:filename', getProfilePicture)

router.patch('/update', auth, uploadProfilePicture.single('profilePicture'), handleErrorProfilePicture, updateProfile)

export default router
