import type { AuthorRepository } from "../data/AuthorRepository.js";
import { Author, type AuthorCreationData, type AuthorUpdateData } from "../domain/Author.js";
import { NotFoundError } from "../domain/errors/NotFoundError.js";
import { HTTPError } from "../presentation/HTTPError.js";

export class AuthorService {
    constructor(private repository: AuthorRepository) { }

    findById(id: Author['data']['id']) {
        const author = this.repository.find(id)
        if (!author) throw new NotFoundError(id, Author.name)
        return author
    }

    list(query?: Parameters<AuthorRepository['list']>[0]) {
        return this.repository.list(query)
    }

    create(creationData: AuthorCreationData) {
        const author = new Author(creationData)
        const existing = this.list({ name: author.data.name })
        if (existing.length > 0) throw new HTTPError('An author with this name already exists', 409)
        this.repository.save(author)
        return author
    }

    delete(id: Author['data']['id']) {
        this.repository.delete(id)
    }

    update(id: Author['data']['id'], updateData: AuthorUpdateData) {
        const existingAuthor = this.findById(id)
        const updatedAuthor = new Author({ ...existingAuthor.data, ...updateData })
        this.repository.save(updatedAuthor)
        return updatedAuthor
    }
}
