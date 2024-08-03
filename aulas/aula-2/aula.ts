import { z } from "zod";

// todos os tipos podem ter modificadores
{
  z.string().min(10).max(20) // string com no mínimo 10 chars e máximo de 20
  z.string().length(5) // exatamente 5 chars
  z.string().email() // um email, outras validações includem uuid, nanoid, ulid, date, email, emoji, etc...
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
