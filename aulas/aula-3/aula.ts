import { z } from 'zod'
// Transformers
{
    // NOTE: Transformers são variações dos refinements
    // a diferença principal é que os transformers vão modificar um objeto
    // e retorna o novo objeto modificado
    interface MeuJSON {
        nome: string
        id: string
        valor: number
        ativo: boolean
    }

    const jsonObject = z.object({
        from: z.string(),
        timestamp: z.number(),
        payload: z.string()
            .refine((v) => {
                try {
                    JSON.parse(v)
                    return true
                } catch (error) {
                    return false
                }
            }, 'Payload precisa ser um JSON válido')
            .transform((v) => JSON.parse(v) as MeuJSON)
    })
    type JSONObject = z.infer<typeof jsonObject>
}

// NOTE: No exemplo acima, o nosso JSON é tipado mas não testado
// Podemos testar um objeto dentro do zod com outro schema do zod
{

    // Esse é um exemplo real
    // primeiro criamos o tipo do JSON
    const MeuJSON = z.object({
        nome: z.string(),
        id: z.string(),
        valor: z.number(),
        ativo: z.boolean()
    })

    // agora criamos o objeto que vamos receber
    const JsonObject = z.object({
        from: z.string(),
        timestamp: z.number(),
        payload: z.string()
            .transform((obj, ctx) => {
                try {
                    const validated = MeuJSON.safeParse(JSON.parse(obj))
                    if (validated.success) {
                        return validated.data
                    }

                    for (const issue of validated.error.issues) {
                        // O transformer também pode adicionar issues e validar
                        // assim não precisamos de um refine
                        ctx.addIssue({
                            ...issue,
                        })
                    }

                    return z.NEVER
                } catch (error) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: [...ctx.path, 'payload'],
                        message: 'Payload precisa ser um JSON válido',
                    })
                    return z.NEVER
                }
            })
    })

    // O transformer vai completar o nosso objeto com o tipo correto
    type JSONObject = z.infer<typeof JsonObject>
}

// NOTE: Transformers podem ser aplicados fora de objetos
{
    // exemplo: user:read user:write content:write
    // será transformado em um array [user:read, user:write, content:write]
    const scopes = z.string().transform(s => s.split(' '))

    // outro uso é para campos computados
    const Computed = z.object({
        users: z.string().uuid().array(),
        accounts: z.string().array(),
        totalAmount: z.number()
    }).transform((obj) => {
        return {
            ...obj,
            // campo computado
            valid: obj.users.length > 1 && obj.accounts.length > 2 && obj.totalAmount <= 10000
        }
    })
    type Computed = z.infer<typeof Computed>
}
