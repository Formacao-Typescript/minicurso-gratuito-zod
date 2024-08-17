import type { Serializable } from "../domain/types.js";

export abstract class Repository<I extends Serializable> {
    protected data: Map<string, I> = new Map()

    save(item: I): this {
        this.data.set(item.data.id, item)
        return this
    }

    find(id: string): I | null {
        const item = this.data.get(id)
        if (!item) return null
        return item
    }
    delete(id: string): this {
        this.data.delete(id)
        return this
    }

    list(query?: { [k in keyof I['data']]?: I['data'][k] }): I[] {
        const items = Array.from(this.data.values())
        if (!query) return items

        return items.filter(item => {
            for (const key of Object.keys(query)) {
                if (query[key] !== item.data[key]) return false
            }
            return true
        })
    }
}
