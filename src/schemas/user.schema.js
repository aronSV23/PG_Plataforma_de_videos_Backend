import { z } from 'zod'

const userSchema = z.object({
  username: z.string({
    required_error: 'Username is required'
  }),
  email: z
    .string({
      required_error: 'Email is required'
    })
    .email({
      message: 'Email is not valid'
    }),
  name: z.string({
    required_error: 'Name is required'
  }).trim(),
  lastName: z.string({
    required_error: 'Last name is required'
  }).trim(),
  password: z
    .string({
      required_error: 'Password is required'
    })
    .min(8, {
      message: 'Password must be at least 8 characters'
    })
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$/, {
      message: 'password must contain lowercase, uppercase and numbers'
    }),
  phone: z.string().trim().optional(),
  bio: z.string().trim().optional()/* ,
  profilePicture: z.string().optional().default('defaultProfilePicture.jpg'),
  role: z.enum(['user', 'admin']).default('user') */
})

export const loginSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required'
    })
    .email({
      message: 'Email is not valid'
    }),
  password: z.string({
    required_error: 'Password is required'
  }).min(8, {
    message: 'Password must be at least 8 characters'
  })
})

// Validar datos del usuario
const validateUser = (data) => userSchema.safeParse(data)

// Validar datos parciales del usuario
const validatePartialUser = (data) => userSchema.partial().safeParse(data)

// Validar datos del usuario en login
const validatelogin = (data) => loginSchema.safeParse(data)

export { validatePartialUser, validateUser, validatelogin }
