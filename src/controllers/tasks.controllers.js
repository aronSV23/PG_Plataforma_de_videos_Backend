import Task from '../models/task.model.js'
import User from '../models/user.model.js'
import { validatePartialTask, validateTask } from '../schemas/task.schema.js'

export const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ teacher: req.user.id }).populate('teacher', 'username name lastName -_id')
    res.json(tasks)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const getTasksAssigned = async (req, res) => {
  try {
    const student = await User.findById(req.user.id)

    if (!student.teacherAssigned) {
      return res.status(400).json({ message: 'you dont have a teacher assigned' })
    }

    const tasks = await Task.find({ teacher: student.teacherAssigned }).populate('teacher', 'username name lastName -_id')
    res.json(tasks)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const createTask = async (req, res) => {
  try {
    const result = validateTask(req.body)

    if (!result.success) {
      const errorMessages = result.error.issues.map(err => ({ path: err.path[0], message: err.message }))
      return res.status(400).json({ errors: errorMessages })
    }

    result.data.teacher = req.user.id

    const newTask = new Task({
      ...result.data
    })

    const saveTask = await newTask.save()
    res.json(saveTask)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params
    const deletedTask = await Task.findByIdAndDelete(taskId)
    if (!deletedTask) { return res.status(404).json({ message: 'Task not found' }) }

    return res.sendStatus(204)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params
    const result = validatePartialTask(req.body)

    if (!result.success) {
      const errorMessages = result.error.issues.map(err => ({ path: err.path[0], message: err.message }))
      return res.status(400).json({ errors: errorMessages })
    }

    const prevTaskData = await Task.findById(taskId)
    if (req.user.id !== prevTaskData.teacher._id.toString()) {
      return res.status(401).json({ message: 'You are not allow to update this task, authorization denied' })
    }

    const taskUpdated = await Task.findOneAndUpdate({ _id: taskId }, result.data, { new: true }).populate('teacher', 'username name lastName -_id')

    return res.json(taskUpdated)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const getTask = async (req, res) => {
  try {
    const { taskId } = req.params

    const task = await Task.findById({ _id: taskId }).populate('teacher', 'username name lastName -_id')
    if (!task) return res.status(404).json({ message: 'Task not found' })
    return res.json(task)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
