import { z } from "zod";

const basePersonSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  birth: z.string().date(),
  email: z.string().email(),
  profileId: z.string().uuid()
})

// intersecções não permitem que você altere o objeto depois
const employeeSchema = basePersonSchema.and(z.object({
  salary: z.number().min(1),
  hireDate: z.string().date(),
  type: z.literal('employee'),
  sector: z.enum(['sales', 'engineering', 'hr', 'rd']),
  manager: z.string().uuid().nullable()
}))
type Employee = z.infer<typeof employeeSchema>

// @ts-expect-error
const employeeSemManager = employeeSchema.omit('manager') // erro

// Ja merges permitem
const userSchema = basePersonSchema.merge(z.object({
  type: z.literal('user'),
  username: z.string(),
  // pelo menos 8 caracteres, um número, uma letra maiúscula e um char especial
  password: z.string().min(8).regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])$/g),
  idCode: z.string().or(z.number()), // podemos fazer com z.union([z.string(), z.number()])
  notes: z.array(z.object({
    date: z.string().datetime().default(new Date().toISOString()),
    value: z.string()
  })).default([]),
  metadata: z.object({
    location: z.string(),
  })
}))
type User = z.infer<typeof userSchema>

const userSemCode = userSchema.omit({ idCode: true })
type UserSemCode = z.infer<typeof userSemCode>

// tipos de update são geralmente variações dos tipos principais
const userUpdateSchema = userSchema.omit({ id: true }).partial() // aqui os objetos internos não são parciais
type UserUpdate = z.infer<typeof userUpdateSchema>

