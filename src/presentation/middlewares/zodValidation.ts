import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

export type ValidatedResponse<TPath extends 'body' | 'query', TSchema extends ZodSchema> = Response<never, { validation: { [k in TPath]: TSchema['_output'] } }>

export function zodValidationMiddleware<TPath extends 'body' | 'query' = 'body', TSchema extends ZodSchema = any>(schema: TSchema, path: TPath) {
    return (req: Request, res: ValidatedResponse<TPath, TSchema>, next: NextFunction) => {
        res.locals.validation = res.locals.validation ?? {}
        const validated = schema.safeParse(req[path]);
        if (validated.success) {
            res.locals.validation[path] = validated.data
            next();
            return
        }

        next(validated.error)
    }
}
