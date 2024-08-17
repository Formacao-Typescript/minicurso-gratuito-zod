export class HTTPError extends Error {
    constructor(message: string, public status: number = 500) {
        super(message)
        this.name = HTTPError.name
    }
}
