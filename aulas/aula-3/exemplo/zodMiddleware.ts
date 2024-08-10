import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export type ValidatedResponse<T> = Response<any, { validatedBody: T }>
export function zodValidationMiddleware<TSchema extends ZodSchema>(schema: TSchema, path: 'body' | 'query' = 'body') {
    return (req: Request, res: ValidatedResponse<TSchema['_output']>, next: NextFunction) => {
        if (!req[path]) next(new Error('Invalid validation path'))
        const result = schema.safeParse(req[path]);

        if (result.success) {
            res.locals.validatedBody = result.data;
            return next()
        }

        return next(result.error);
    };
}
