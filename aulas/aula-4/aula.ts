import { z } from 'zod'

// NOTE: Temos alguns tipos que não são relacionados a outras coisas que vimos

// Tuplas
{
    // NOTE: Tuplas são arrays com tamanho fixo e tipos fixos
    // neste caso estamos dizendo que a tupla tem 2 elementos, o primeiro é uma string
    // e o segundo é um número
    const tuplas = z.tuple([z.string(), z.number()])
    type Tuplas = z.infer<typeof tuplas> // [string, number]

    // NOTE: Não confunda com arrays, maps ou records que podem ter N elementos
    const arrays = z.array(z.string()) //  string[] ilimitado
    type Arrays = z.infer<typeof arrays> // string[]

    const objetos = z.record(z.number()) // Record<string, number> ilimitado
    type Objetos = z.infer<typeof objetos> // { [key: string]: number }

    const maps = z.map(z.string(), z.number()) // Map<string, number> ilimitado
    type Maps = z.infer<typeof maps> // Map<string, number>
}

// Variádicos
{
    // NOTE: variádicos representam o resto de um argumento
    // neste caso estamos dizendo que a tupla tem 2 elementos, os dois primeiros são números
    // e os próximos são arrays de strings
    const tuplaVariadica = z.tuple([z.number(), z.number()]).rest(z.tuple([z.string()]))
    type TuplaVariadica = z.infer<typeof tuplaVariadica> // [number, number, ...string[]]
}

// Functions
{
    //NOTE: Um caso de uso pouco usado são as ZodFunctions
    //que permitem definir funções e implementações que são seguras
    //tanto em runtime quanto em compile time
    const reverse = z.function()
        .args(z.string())
        .returns(z.string())
        .implement((s) => s.split("").reverse().join(""))

    // NOTE: O problema é que, por padrão, todos os argumentos são variádicos
    // então somente o primeiro é tipado neste caso como string, os demais como unknown
    const s = reverse('Olá') // álO
    const x = reverse('string1', 'string2') // não deveria acontecer
}
