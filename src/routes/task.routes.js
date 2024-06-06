import { Router } from 'express'
import { createTask, deleteTask, getMyTasks, getTask, getTasksAssigned, updateTask } from '../controllers/tasks.controllers.js'
import { auth } from '../middlewares/auth.middleware.js'
import { isATeacher } from '../middlewares/isATeacher.middleware.js'

const router = Router()

router.get('/', auth, isATeacher, getMyTasks)

router.get('/tasksAssigned', auth, getTasksAssigned)

router.post('/', auth, isATeacher, createTask)

router.get('/:taskId', auth, getTask)

router.patch('/:taskId', auth, isATeacher, updateTask)

router.delete('/:taskId', auth, isATeacher, deleteTask)

export default router
