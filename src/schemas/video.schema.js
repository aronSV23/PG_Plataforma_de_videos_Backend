import { z } from 'zod'

// Esquema de validación para los datos del video
const videoSchema = z.object({
  title: z
    .string({
      required_error: 'Title is required'
    })
    .trim(),
  description: z
    .string()
    .trim().optional(),
  tags: z
    .string({
      invalid_type_error: 'tags must be strings'
    })
    .optional(),
  views: z
    .number().int().positive().optional(),
  task: z
    .string().optional()
  /* ,
  filePath: z
    .string({
      required_error: 'File path is required'
    }),
  thumbnail: z
    .string().optional() */
})

// Validar datos del video
const validateVideo = (data) => videoSchema.safeParse(data)

// Validar datos del video
const validatePartialVideo = (data) => videoSchema.partial().safeParse(data)

const validateScore = (data) => z.object({ score: z.number({ required_error: 'Score is required' }).min(0, { message: 'Score must be at least 0' }).max(10, { message: 'Score cannot exceed 10' }) }).safeParse(data)

const validateLikes = (data) => z.object({ likes: z.number().int().positive() }).safeParse(data)

const validateViews = (data) => z.object({ views: z.number().int().positive() }).safeParse(data)

export { validateLikes, validatePartialVideo, validateScore, validateVideo, validateViews }

