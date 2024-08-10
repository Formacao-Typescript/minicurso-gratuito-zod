import express, { NextFunction, Request, Response } from 'express';
import { BookSchema } from './schemas';
import { ZodError } from 'zod';
import { zodValidationMiddleware } from './zodMiddleware';

async function main() {
    const app = express();
    app.use(express.json())

    app.get('/ping', (_, res) => {
        return res.send('pong')
    })

    app.post('/books', zodValidationMiddleware(BookSchema), (_, res) => {
        res.json(res.locals.validatedBody)
    })

    app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
        if (err instanceof ZodError) {
            return res.status(422).json(err)
        }

        return res.status(500).json({ message: 'Internal server error' })
    })

    return app
}

main()
    .then((server) => {
        server.listen(3000, () => console.log('Listening'))
    })
    .catch(console.error) 
