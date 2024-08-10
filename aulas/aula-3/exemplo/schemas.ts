import { z } from "zod";

export const AuthorSchema = z.object({
    name: z.string(),
    birthDate: z.string().date(),
    bio: z.string().max(1900),
    country: z.string()
})
export type Author = z.infer<typeof AuthorSchema>

export const BookSchema = z.object({
    authors: z.array(AuthorSchema).min(1),
    name: z.string(),
    description: z.string().max(2000),
    publishDate: z.string().date(),
    isbn: z.string().length(13).regex(/^\d+$/),
    stockAmount: z.number().int().refine(v => v >= 0, { message: 'Stock amount must be greater than or equal to 0' }).default(0)
})
export type Book = z.infer<typeof BookSchema>
