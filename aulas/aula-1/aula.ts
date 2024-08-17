import { z } from 'zod'

// Definindo um schema simples
{
    const stringSchema = z.string() // aceita apenas string
    // Outros primitivos também são possíveis
    z.boolean()
    z.number()
    z.bigint()
    z.undefined()
    z.null()

    // Podemos usar até mesmo outros primitivos
    z.void()
    z.date()
    z.symbol()

    // Tipos gerais
    z.any() // permite qualquer tipo e vai ser inferido como any
    z.unknown() // mesma coisa porém vai ser inferido como unknown
    z.never() // não permite nada
}

// Inferência de tipos
{
    // Tipos vão ser inferidos direto do schema
    const stringSchema = z.string()
    type stringDoSchema = z.infer<typeof stringSchema> // string

    // O mesmo vale para outros tipos
    const unknownSchema = z.unknown()
    type unknownType = z.infer<typeof unknownSchema> // unknown

    // Permite gerar tipos direto do nosso schema
}

// Parsing de schemas, aplicando as regras
{
    const arrayDeStrings = z.string().array()
    const outroArrayDeStrings = z.array(z.string()) // Análogos
    type stringArray = z.infer<typeof arrayDeStrings>

    const apenasArraysThrow = (a: any) => {
        // se o parâmetro não for um array de strings, vamos ter um throw
        const parsed = arrayDeStrings.parse(a)
    }

    const apenasArraysAsync = async (a: any) => {
        // Funciona da mesma forma que a anterior porém é uma promise
        const parsed = await arrayDeStrings.parseAsync(a)
    }

    // Safe parse permite tratar os erros de forma separada
    const safeParse = (a: any) => {
        const response = arrayDeStrings.safeParse(a)
        // Response é uma discriminated union baseada na propriedade success
        if (!response.success) {
            // tratamento de erros aqui
            throw new Error(response.error.message)
        }

        return response.data // data tem o conteúdo depois do parsing
    }
}

// Tipos compostos
{
    // Tipos primitivos são simples demais
    // E não refletem exatamente o que a gente precisa
    // Mas objetos sim
    const createUserSchema = z.object({
        name: z.string(),
        age: z.number().optional(), // por padrão todas as propriedades são obrigatórias
        email: z.string().email(), // podemos definir o tipo que esperamos
        birth: z.string().datetime(),
        isPaidUser: z.boolean().default(false), // propriedades padrão se tornam opcionais
        type: z.string(), // TODO: podemos melhorar isso
        scopes: z.string().array().min(1).default(['user'])
    })
    type CreateUserPayload = z.infer<typeof createUserSchema>
}
