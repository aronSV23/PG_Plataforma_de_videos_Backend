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
    .number().int().positive().optional()/* ,
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

export { validatePartialVideo, validateVideo }
