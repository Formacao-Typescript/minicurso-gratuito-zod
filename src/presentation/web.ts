import { Server } from "http";
import type { AppConfig } from "../config.js";
import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";

export async function web(config: AppConfig) {
    const app = express();

    app.use(express.json())
    app.get('/ping', (req, res) => res.send('pong'))
    app.use('/books', bookRouter(config))
    app.use('/authors', authorRouter(config))

    app.use(errorHandler)

    const server = new Server(app)

    return {
        server,
        shutdown: () => {
            server.close()
        }
    }
}
