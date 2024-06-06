import { z } from 'zod'

const taskSchema = z.object({
  title: z.string({
    required_error: 'Title is required'
  }),
  description: z.string({
    required_error: 'Description is required'
  }),
  deadline: z.string({
    required_error: 'Date is required'
  }).datetime()
})

const validateTask = (data) => taskSchema.safeParse(data)

// Validar datos parciales del usuario
const validatePartialTask = (data) => taskSchema.partial().safeParse(data)

export { validatePartialTask, validateTask }
