import { z } from "zod";

const appConfigSchema = z.object({
  NODE_ENV: z.string(), // TODO: melhorar
  PORT: z.coerce.number().default(3000),
  MONGODB_CONNECTION_STRING: z.string().default('mongodb://localhost:27017'),
  MONGODB_DATABASE: z.string().default('bookstore'),
  JWT_SECRET: z.string(),
  JWT_AUDIENCE: z.string(),
  PBKDF2_ITERATIONS: z.coerce.number().default(100000),
  PBKDF2_KEYLEN: z.coerce.number().default(64),
})

export type AppConfig = z.infer<typeof appConfigSchema>
export const appConfig = appConfigSchema.parse(process.env)

