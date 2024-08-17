import { Router } from "express";
import { AuthorCreationSchema, AuthorSchema, AuthorUpdateSchema } from "../domain/Author.js";
import { BookCreationSchema, BookSchema, BookUpdateSchema } from "../domain/Book.js";
import type { AuthorService } from "../services/AuthorService.js";
import type { BookService } from "../services/BookService.js";
import { zodValidationMiddleware } from "./middlewares/zodValidation.js";

export function bookRouter(bookService: BookService) {
    const router = Router()

    router.get('/', zodValidationMiddleware(BookSchema.partial(), 'query'), (_req, res) => {
        res.json(bookService.list(res.locals.validation.query).map(book => book.data))
    })

    router.get('/:id', (req, res) => {
        const { id } = req.params
        const { data } = bookService.findById(id)
        res.json(data)
    })

    router.post('/', zodValidationMiddleware(BookCreationSchema, 'body'), (_req, res) => {
        const book = bookService.create(res.locals.validation.body)
        res.status(201).json(book.data)
    })

    router.put('/:id', zodValidationMiddleware(BookUpdateSchema, 'body'), (req, res) => {
        const { id } = req.params
        const book = bookService.update(id, res.locals.validation.body)
        res.json(book.data)
    })

    router.delete('/:id', (req, res) => {
        const { id } = req.params
        bookService.delete(id)
        res.status(204).send()
    })

    return router
}


export function authorRouter(authorService: AuthorService, bookService: BookService) {
    const router = Router()

    router.get('/', zodValidationMiddleware(AuthorSchema.partial(), 'query'), (_req, res) => {
        res.json(authorService.list(res.locals.validation.query).map(author => author.data))
    })

    router.get('/:id', (req, res) => {
        const { id } = req.params
        const { data } = authorService.findById(id)
        res.json(data)
    })

    router.post('/', zodValidationMiddleware(AuthorCreationSchema, 'body'), (_req, res) => {
        console.log(res.locals)
        const author = authorService.create(res.locals.validation.body)
        res.status(201).json(author.data)
    })

    router.put('/:id', zodValidationMiddleware(AuthorUpdateSchema, 'body'), (req, res) => {
        const { id } = req.params
        const author = authorService.update(id, res.locals.validation.body)
        res.json(author.data)
    })

    router.delete('/:id', (req, res) => {
        const { id } = req.params
        authorService.delete(id)
        res.status(204).send()
    })

    router.get('/:id/books', (req, res) => {
        const { id } = req.params
        const books = bookService.list({ authorId: id })
        res.json(books.map(book => book.data))
    })

    return router
}
