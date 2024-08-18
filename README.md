# Projeto final

<!--toc:start-->
- [Projeto final](#projeto-final)
- [Descrição](#descrição)
- [Arquitetura proposta](#arquitetura-proposta)
  - [Executando o projeto](#executando-o-projeto) 
<!--toc:end-->

> Esse é o repositório do projeto finalizado a partir da aula 5 do minicurso
> gratuito de Zod da [Formação TS](https://formacaots.com.br).

## Descrição

O projeto é um sistema pequeno que simula um cadastro de livros de uma
biblioteca, ele não possui conexão com banco de dados e os dados são salvos em
memória. O projeto foi feito com o intuito de ensinar a utilizar o Zod para
validação de dados.

A ideia é que possamos entender como o processo de validação funciona a partir
de um modelo de desenvolvimento que utiliza os schemas do Zod como fonte
principal de dados, eu chamo este modelo de _Schema Driven Development_.

Os principais arquivos podem ser encontrados na pasta [domain](./src/domain/)
onde definimos todos os objetos de domínio e seus respectivos schemas.

- [Book.ts](./src/domain/Book.ts): Define o objeto de livro e seu schema,
perceba que a gente está usando o schema como fonte da informação. Não estamos
realizando nenhuma validação manualmente.
- [Author.ts](./src/domain/Author.ts): Este é o objeto de autor e seu schema,
ele é utilizado para validar os dados de autor.

### Arquitetura proposta

A arquitetura proposta nesse projeto é um exemplo do que pode ser feito, mas de
forma alguma é a única forma de se trabalhar com Zod. A ideia é que a gente
possa ter um modelo de desenvolvimento que seja baseado em schemas, onde a gente
possa utilizar os schemas como fonte de informação.

Para isso usei um misto da arquitetura MVC com algumas ideias emprestadas do
DDD, estamos separando o projeto em:

- **Repositories**: Na camada _data_ temos os repositórios que são responsáveis
por salvar e buscar os dados, nesse caso estamos salvando em memória usando uma
implementação de um banco de dados abstrato que é estendido pelas classes
concretas. Dessa forma podemos sempre utilizar a mesma base para poder criar
todos os repositórios.
- **Domain**: Objetos de domínio que vão ser utilizados ao longo da aplicação, a
ideia aqui é termos todos os objetos que são utilizados como entidades ao redor
do sistema e seus respectivos erros diretamente posicionados aqui.
- **Services**: É a camada de cola entre nosso usuário, a camada de domínio e a
camada de dados. Vai repassar os dados enviados pelo usuário para as camadas
mais internas da aplicação e retornar o resultado tratando os erros que
acontecem em uma camada mais abaixo para as camadas de cima, por exemplo,
convertendo erros de validação em erros HTTP.
- **Presentation**: É a camada de visualização que vai interagir com o usuário,
podemos ter várias camadas de apresentação, por exemplo, uma CLI, uma API, um
GraphQL e assim vai. Essa camada recebe os dados de usuário, faz a validação
correta, lança os erros necessários e chama os serviços necessários para que
todos os dados sejam processados.

## Executando o projeto

Faça o clone desse repositório, rode `npm install` na pasta raiz e depois `npm
run dev` para executar o projeto. Por padrão o projeto vai rodar na porta 3000.
Se você quiser trocar a porta, basta criar um arquivo `.env` na raiz com o valor
`PORT=xxxx`, veja o [arquivo de configuração](./src/config.ts) para saber quais
as variáveis disponíveis.
