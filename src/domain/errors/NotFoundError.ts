import { HTTPError } from "../../presentation/HTTPError.js";

export class NotFoundError extends HTTPError {
    constructor(id: string, entityName?: string) {
        super(`${entityName ?? 'Entity'} with id ${id} not found`, 404)
        this.name = NotFoundError.name
    }
}
