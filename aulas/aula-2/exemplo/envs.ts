import { z } from "zod";

const appConfigSchema = z.object({
    NODE_ENV: z.enum(['development', 'production']).default('development'),
    PORT: z.coerce.number().default(3000),
    MONGODB_CONNECTION_STRING: z.string().default('mongodb://localhost:27017'),
    MONGODB_DATABASE: z.string().default('bookstore'),
    JWT_SECRET: z.string(),
    JWT_AUDIENCE: z.string(),
    PBKDF2_ITERATIONS: z.coerce.number().default(100000),
    PBKDF2_KEYLEN: z.coerce.number().default(64),
    APP_URL: z.string().url().default('http://localhost:3000'),
}).refine((envs) => {
    if (envs.NODE_ENV === 'production') {
        if (/.*localhost.*/.test(envs.APP_URL)) return false
    }
    return true
}, { message: 'APP_URL must not be localhost in production' }
);

export type AppConfig = z.infer<typeof appConfigSchema>
export const appConfig = appConfigSchema.parse(process.env)

