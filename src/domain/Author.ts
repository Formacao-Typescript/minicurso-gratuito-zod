import { randomUUID } from "crypto";
import { z } from "zod";

export const AuthorSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    birthdate: z.string().date().optional(),
    bio: z.string().max(500).optional(),
})

export const AuthorCreationSchema = AuthorSchema.partial({ id: true });
export type AuthorCreationData = z.infer<typeof AuthorCreationSchema>;

export const AuthorUpdateSchema = AuthorSchema.partial().omit({ id: true });
export type AuthorUpdateData = z.infer<typeof AuthorUpdateSchema>;

export class Author {
    data: z.infer<typeof AuthorSchema> | Record<string, never> = {}
    constructor(props: AuthorCreationData) {
        const validated = AuthorCreationSchema.parse(props);
        this.data = { ...validated, id: validated.id ?? randomUUID() };
    }

    toJSON() {
        return JSON.stringify(this.data)
    }
}
