import { z } from "zod";

// todos os tipos podem ter modificadores
{
    z.string().min(10).max(20) // string com no mínimo 10 chars e máximo de 20
    z.string().length(5) // exatamente 5 chars
    z.string().email() // um email, outras validações incluem uuid, nanoid, ulid, date, email, emoji, etc...
    // mensagens personalizadas
    z.number().negative('Número não é negativo')
    z.number().positive('Número não é positivo')

    z.string().array().min(1) // array não nulo
}

// Validações de objetos
{
    const createUserSchema = z.object({
        name: z.string(),
        age: z.number().optional(),
        email: z.string().email(),
        birth: z.string().datetime(),
        isPaidUser: z.boolean().default(false),
        type: z.enum(['user', 'employee', 'admin']), // aceita apenas esses valores
        scopes: z.enum(['user', 'admin', 'read', 'write']).array().min(1).default(['user']), // array de valores possíveis
        lastLogin: z.string().datetime().nullable() // não pode ser undefined mas pode ser nulo
    })
    type CreateUserPayload = z.infer<typeof createUserSchema>
}

// estendendo objetos
{
    const createUserSchema = z.object({
        name: z.string(),
        age: z.number().optional(),
        email: z.string().email(),
        birth: z.string().date(),
        isPaidUser: z.boolean().default(false),
        type: z.enum(['user', 'employee', 'admin']), // aceita apenas esses valores
        scopes: z.enum(['user', 'admin', 'read', 'write']).array().min(1).default(['user']), // array de valores possíveis
        lastLogin: z.string().datetime().nullable() // não pode ser undefined mas pode ser nulo
    })
    type CreateUserPayload = z.infer<typeof createUserSchema>

    // Podemos usar o mesmo objeto do schema anterior para poder adicionar novas propriedades

    // isso vai nos dar um erro
    const strictUserSchema = createUserSchema.strict() // não permite novas propriedades não conhecidas
    type StrictUserSchema = z.infer<typeof strictUserSchema>

    strictUserSchema.parse({
        name: 'Lucas',
        email: 'hello@lsantos.dev',
        birth: '1990-01-01',
        type: 'user',
        lastLogin: null,
        notProp: true
    })

    // a chave notProp vai ser removida
    createUserSchema.parse({
        name: 'Lucas',
        email: 'hello@lsantos.dev',
        birth: '1990-01-01',
        type: 'user',
        lastLogin: null,
        notProp: true
    })

    // com passthrough as chaves não conhecidas vão passar para o objeto final
    const looseUserSchema = createUserSchema.passthrough()
    looseUserSchema.parse({
        name: 'Lucas',
        email: 'hello@lsantos.dev',
        birth: '1990-01-01',
        type: 'user',
        lastLogin: null,
        notProp: true
    })
}

// Unions e intersections
{
    // une dois tipos, imagine como se fosse um OR
    const stringOrNumber = z.union([z.string(), z.number()])
    const stringOrNumber2 = z.string().or(z.number())
    type stringOrNumberType = z.infer<typeof stringOrNumber>

    const urlOpcional = z.union([z.string().url().optional(), z.literal("")])
    // é opcional mas se existir tem que ser uma URL
    urlOpcional.parse('') // ok
    urlOpcional.parse('nãoéurl') // erro
    urlOpcional.parse('https://formacaots.com.br') // ok
}

// extensões de objetos
{
    const basePersonSchema = z.object({
        id: z.string().uuid(),
        name: z.string(),
        birth: z.string().date(),
        email: z.string().email(),
        profileId: z.string().uuid()
    })

    // NOTE: Importante dizer que a.and(b) não retorna um zod object
    // então você não pode manipular esse objeto livremente com .pick ou .omit por exemplo
    // nesse caso também podemos usar extends, que é a mesma coisa
    // .shape é usado para obter o tipo do objeto cru, com somente as chaves e valores
    // mas ambos retornam um objeto completo
    const employeeSchema = basePersonSchema.and(z.object({
        salary: z.number().min(1),
        hireDate: z.string().date(),
        type: z.literal('employee'),
        sector: z.enum(['sales', 'engineering', 'hr', 'rd']),
        manager: z.string().uuid().nullable()
    }))
    type Employee = z.infer<typeof employeeSchema>

    // @ts-expect-error
    const employeeSemManager = employeeSchema.omit('manager') // erro

    // Ja merges permitem
    const userSchema = basePersonSchema.merge(z.object({
        type: z.literal('user'),
        username: z.string(),
        // pelo menos 8 caracteres, um número, uma letra maiúscula e um char especial
        password: z.string().min(8).regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])$/g),
        idCode: z.string().or(z.number()), // podemos fazer com z.union([z.string(), z.number()])
        notes: z.array(z.object({
            date: z.string().datetime().default(new Date().toISOString()),
            value: z.string()
        })).default([]),
        metadata: z.object({
            location: z.string(),
        })
    }))
    type User = z.infer<typeof userSchema>

    const userSemCode = userSchema.omit({ idCode: true })
    type UserSemCode = z.infer<typeof userSemCode>

    // tipos de update são geralmente variações dos tipos principais
    const userUpdateSchema = userSchema.omit({ id: true }).partial() // aqui os objetos internos não são parciais
    type UserUpdate = z.infer<typeof userUpdateSchema>

    const updatepayload: UserUpdate = {}
}

// refinements
{
    // NOTE: refinements são lógicas de validação customizadas
    // para atender casos onde o sistema de tipos do TS não 
    // não consegue representar os dados com certeza

    const pares = z.number().refine((num) => num % 2 === 0, 'Não é um número par')
    pares.parse(1) // não é um numero par
    pares.parse(2) // ok

    // Geralmente o refine é usado para poder obter
    // dados de dentro do mesmo schema também
    z.object({
        password: z.string(),
        confirmPassword: z.string()
    })
        .refine((obj) => obj.password === obj.confirmPassword, 'A senhas não são iguais')

    // NOTE: existe uma outra versão do refine
    // o SuperRefine, que é o método chamado originalmente pelo refine
    // ele permite modificar o objeto de erro que é retornado
    enum Countries {
        USA = 'usa',
        UK = 'uk',
        FR = 'fr',
        BR = 'br'
    }
    // NOTE: Aqui vamos validar se um objeto tem um objeto específico
    // mas somente se o país for USA ou UK
    const parcial = z.object({
        country: z.nativeEnum(Countries),
        specificConfiguration: z.object({
            phonePrefix: z.number().max(3),
            phoneMask: z.string(),
            currency: z.string()
        }).optional()
    })
        // NOTE: o super refine vai retornar um error se ctx.addIssue for chamado
        .superRefine((obj, ctx) => {
            if ([Countries.UK, Countries.USA].includes(obj.country)) {
                if (!obj.specificConfiguration) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom, // NOTE: podemos usar erros definidos pelo zod aqui
                        message: `${obj.country} precisa de um objeto de configuração`,
                        path: [...ctx.path, 'specificConfiguration'],
                        fatal: true,
                    })
                    return z.NEVER // evita qualquer outra validação
                }
            }
        })
}
