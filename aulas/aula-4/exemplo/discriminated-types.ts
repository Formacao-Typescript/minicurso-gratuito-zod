//NOTE: e se a gente quiser um objeto que pode ser variado
//dependendo de uma chave específica?
//podemos usar discriminated unions

import { RefinementCtx, z, ZodSchema, ZodString, ZodStringDef, ZodType } from "zod"

// vamos pegar o exemplo da outra aula
// com um JSON interno
const userPayload = z.object({
    nome: z.string(),
    id: z.string(),
    valor: z.number(),
    ativo: z.boolean()
})

const opsPayload = userPayload
    .omit({ nome: true })
    .merge(z.object({
        opsId: z.string().uuid(),
        ticket: z.number(),
        referencia: z.any()
    }))

const adminPayload = opsPayload
    .omit({ opsId: true, ticket: true })
    .merge(z.object({
        adminId: z.string().ulid(),
        sobrescrito: z.boolean(),
        idSetor: z.string().uuid()
    }))

// agora criamos o objeto que vamos receber
// mas e se o objeto que recebermos puder trocar de modelo de acordo com o tipo de usuário?
// podemos, claro, adicionar no nosso transform
// mas teríamos que transformar o objeto todo
const payloadRecebido = z.object({
    from: z.enum(['user', 'ops', 'admin']),
    timestamp: z.number(),
    payload: z.string()
})
    .transform((obj, ctx) => {
        try {

            let dataToParse: ZodSchema = {
                'user': userPayload,
                'ops': opsPayload,
                'admin': adminPayload
            }[obj.from]

            const validated = dataToParse.safeParse(JSON.parse(obj.payload))
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

// Mas isso não vai dar um tipo válido para nós
// porque temos múltiplos branches de código
type PayloadRecebido = z.infer<typeof payloadRecebido> // any

/*************************************************/

// O ideal é usarmos discriminated unions
// para isso vamos copiar nosso payload aqui porque já transformamos antes
const basePayload = z.object({
    from: z.enum(['user', 'ops', 'admin']),
    timestamp: z.number(),
    payload: z.string() // json
})

//vamos criar uma função para converter nosso payload
function convert<T extends ZodSchema>(payload: T) {
    return (obj: string, ctx: RefinementCtx) => {
        try {
            const validated = payload.safeParse(JSON.parse(obj))
            if (validated.success) return validated.data as T['_output']


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
    }
}

const discriminatedPayload = z.discriminatedUnion('from', [
    basePayload.merge(z.object({
        from: z.literal('user'),
        payload: z.string().transform(convert(userPayload))
    })),
    basePayload.merge(z.object({
        from: z.literal('ops'),
        payload: z.string().transform(convert(opsPayload))
    })),
    basePayload.merge(z.object({
        from: z.literal('admin'),
        payload: z.string().transform(convert(adminPayload))
    })),
])
type PayloadComplexo = z.infer<typeof discriminatedPayload>

// Agora se a gente fizer um objeto manual e colocar o tipo correto
// assumindo que já temos o objeto validado
const x: PayloadComplexo = {
    from: 'user', // TODO: Tente mudar para ops ou admin
    timestamp: Date.now(),
    payload: {
        nome: 'string',
        id: 'string',
        valor: 123,
        ativo: true
    }
}
