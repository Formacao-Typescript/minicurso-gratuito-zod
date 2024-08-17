import express from "express";
import { Server } from "http";
import type { AppConfig } from "../config.js";
import { AuthorRepository } from "../data/AuthorRepository.js";
import { BookRepository } from "../data/BookRepository.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { authorRouter, bookRouter } from "./routes.js";
import { AuthorService } from "../services/AuthorService.js";
import { BookService } from "../services/BookService.js";

export async function web(_config: AppConfig) {
    const repsitories = {
        author: new AuthorRepository(),
        book: new BookRepository()
    }
    const authorService = new AuthorService(repsitories.author)
    const bookService = new BookService(repsitories.book, authorService)

    const app = express();

    app.use(express.json())
    app.get('/ping', (_req, res) => res.send('pong'))
    app.use('/books', bookRouter(bookService))
    app.use('/authors', authorRouter(authorService, bookService))

    app.use(errorHandler)

    const server = new Server(app)

    return {
        server,
        shutdown: () => {
            server.close()
        }
    }
}
