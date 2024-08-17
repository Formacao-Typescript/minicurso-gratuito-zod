import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { HTTPError } from "../HTTPError.js";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
    switch (true) {
        case err instanceof ZodError:
            return res.status(422).json({ message: err.format()._errors[0], errors: err.issues })
        case err instanceof HTTPError:
            return res.status(err.status).json({ message: err.message })
        default:
            return res.status(500).json({ message: err.message ?? 'Internal server error' })
    }
}
