import { z } from "zod";
import { AuthorSchema } from "./Author.js";
import { randomUUID } from "crypto";

export const BookSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    authorId: AuthorSchema.shape.id,
    releaseDate: z.string().date().optional(),
    pages: z.number().positive(),
    description: z.string().max(500).optional(),
    isbn: z.string().length(13),
})
export type BookData = z.infer<typeof BookSchema>;

export const BookCreationSchema = BookSchema.partial({ id: true });
export type BookCreationData = z.infer<typeof BookCreationSchema>;

export const BookUpdateSchema = BookSchema.partial().omit({ id: true });
export type BookUpdateData = z.infer<typeof BookUpdateSchema>;

export class Book {
    data: z.infer<typeof BookSchema> | Record<string, never> = {}
    constructor(props: BookCreationData) {
        const validated = BookCreationSchema.parse(props);
        this.data = { ...validated, id: validated.id ?? randomUUID() };
    }
    toJSON() {
        return JSON.stringify(this.data)
    }
}
