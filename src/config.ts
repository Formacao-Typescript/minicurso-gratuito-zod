import { z } from 'zod';

const configSchema = z.object({
    PORT: z.coerce.number().default(3000),
    NODE_ENV: z.string().default('development'),
    DB_LOCATION_PATH: z.string().default('db.json'),
});

export type AppConfig = z.infer<typeof configSchema>;
export const appConfig = configSchema.parse(process.env);
