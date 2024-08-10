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

    // do outro lado temos intersections
    const FuncionarioBase = z.object({
        matricula: z.number(),
        salario: z.number()
    })

    const PessoaBase = z.object({
        nome: z.string(),
        cpf: z.string()
    })

    const FuncionarioIntersection = z.intersection(FuncionarioBase, PessoaBase)
    const Funcionario = PessoaBase.and(FuncionarioBase)
    type Funcionario = z.infer<typeof Funcionario>
    // Agora o funcionário tem todas as propriedades de ambos
    // @ts-ignore
    const x: Funcionario = {}

    // NOTE: Importante dizer que a.and(b) não retorna um zod object
    // então você não pode manipular esse objeto livremente com .pick ou .omit por exemplo
    // nesse caso também podemos usar extends, que é a mesma coisa
    // .shape é usado para obter o tipo do objeto cru, com somente as chaves e valores
    // mas ambos retornam um objeto completo
    const FuncionarioExtends = PessoaBase.extend(FuncionarioBase.shape)
    const FuncionarioMerge = PessoaBase.merge(FuncionarioBase)
}

// refinements 
{

}
