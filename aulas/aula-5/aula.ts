//NOTE: Para a última parte, vamos aprender branded types

import { z } from "zod";

{
    // NOTE: Branded types são uteis para poder dar um valor diferente
    // a tipos que são comuns, por exemplo, uma string que é um ID
    const string = z.string() // ok mas não distingue o que é uma string ou um ID
    const ID = z.string().uuid().brand('ID') // o tipo será uma string, porém marcada como ID
    type UUID = z.infer<typeof ID> // string & z.BRAND<ID>

    const strfn = (id: string) => id
    strfn('1') // aceita qualquer coisa inclusive se não for um UUID

    const idfn = (id: UUID) => id
    // @ts-expect-error
    idfn('1') // erro

    const id = ID.parse('algumID') // isso vai dar erro porque não é uuid
    idfn(id) // mas isso funciona porque agora  o tipo é um ID
}

{
    //NOTE: um uso comum é para representar moedas
    const BRL = z.number().brand('BRL')
    type BRL = z.infer<typeof BRL>

    const EUR = z.number().brand('EUR')
    type EUR = z.infer<typeof EUR>

    const USD = z.number().brand('USD')
    type USD = z.infer<typeof USD>

    // funções de conversão trocam os tipos
    function BRLtoUSD(input: BRL): USD {
        return USD.parse(input)
    }

    // podemos converter reais para USD
    const reais: BRL = BRL.parse(50)
    const dolares = BRLtoUSD(reais)
    // mas não o contrário
    const reaisDeNovo = BRLtoUSD(dolares) // erro
}
