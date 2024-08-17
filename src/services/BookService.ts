import type { BookRepository } from "../data/BookRepository.js";
import type { Author } from "../domain/Author.js";
import { Book, type BookCreationData, type BookUpdateData } from "../domain/Book.js";
import { NotFoundError } from "../domain/errors/NotFoundError.js";
import { HTTPError } from "../presentation/HTTPError.js";
import type { AuthorService } from "./AuthorService.js";

export class BookService {
    constructor(private repository: BookRepository, private authorService: AuthorService) { }

    findById(id: Book['data']['id']) {
        const book = this.repository.find(id)
        if (!book) throw new NotFoundError(id, Book.name)
        return book
    }

    list(query?: Parameters<BookRepository['list']>[0]) {
        return this.repository.list(query)
    }

    create(creationData: BookCreationData) {
        const book = new Book(creationData)
        const existing = this.list({ isbn: book.data.isbn })
        if (existing.length > 0) throw new HTTPError('An book with this isbn already exists', 409)
        this.authorService.findById(book.data.authorId)

        this.repository.save(book)
        return book
    }

    delete(id: Book['data']['id']) {
        this.repository.delete(id)
    }

    update(id: Book['data']['id'], updateData: BookUpdateData) {
        const existingBook = this.findById(id)
        const updatedBook = new Book({ ...existingBook.data, ...updateData })
        this.repository.save(updatedBook)
        return updatedBook
    }
}
