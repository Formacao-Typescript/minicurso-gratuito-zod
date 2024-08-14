import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

export type ValidatedResponse<T extends 'body' | 'query', S extends ZodSchema> = Response<never, { validation: { [k in T]: S['_output'] } }>

export function zodValidationMiddleware<T extends 'body' | 'query' = 'body', S extends ZodSchema = any>(schema: S, path: T) {
    return (req: Request, res: ValidatedResponse<T, S>, next: NextFunction) => {
        const validated = schema.safeParse(req[path]);
        if (validated.success) {
            res.locals.validation[path] = validated.data
            next();
            return
        }

        next(validated.error)
    }
}
