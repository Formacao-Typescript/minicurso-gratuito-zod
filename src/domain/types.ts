export interface Serializable<TData extends { id: string, [K: string]: unknown } = { id: string, [K: string]: unknown }> {
    data: TData;
    toJSON(): string;
}

export interface SerializableStatic {
    collectionName: string
    new(...args: any[]): InstanceType<this>
}
