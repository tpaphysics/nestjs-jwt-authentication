<p align="center">
  <a href="https://github.com/tpaphysics/react-urban-shaves-desktop" target="blank">
  <img src="https://raw.githubusercontent.com/tpaphysics/react-urban-shaves-desktop/main/assets/desktop/logo.png"  alt="urban-shaves-logo" /></a>
</p>
<p align="center">
<img src="https://img.shields.io/badge/yarn-%232C8EBB.svg?style=for-the-badge&logo=yarn&logoColor=white" alt="yarn" />
  
<img src="https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJs" />

<img src="https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white" alt="jEST" />

<img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma.io" />
  
<img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  
<img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" alt="Prisma" />
  
<img src="https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white" alt="Prisma" />

## Descrição

O API <strong>Urban Shaves</strong> criada para integração entre os apps [Urban Shaves web](https://github.com/tpaphysics/react-urban-shaves-web) e [Urban Shaves mobile](https://github.com/tpaphysics/react-native-urban-shaves-mobile) está sendo desenvolvida em [NestJs](https://nestjs.com/). Possui fluxo de autenticação JWT, como ORM utilizamos o [Prisma](https://www.prisma.io/) e para documentação o [Swagger](https://swagger.io/). Utilizamos o banco de dados postgres através do [Docker Compose](https://docs.docker.com/compose/).

## Instalação

```bash
# Instalação das dependências
$ yarn

# Iniciar container com banco de dados postgress (Você precisa ter o docker instalado!):
$ yarn up:db

# Migração dos models definidos no schema.prisma para o banco de dados
$ yarn prisma migrate dev
```

## Iniciando o servidor

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

```

Para remover o container com o postgres:

```bash
$ yarn rm:db
```

## Observação

Para tornar uma rota pública basta adicionar o decorator <strong>@IsPublicRoute()</strong> como no exemplo abaixo:

```typescript
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @IsPublicRoute()
  @Post()
  createUser() {...}
}
```

## Documentalçao com swagger

```text
http://localhost:3000/api/appointments
http://localhost:3000/api/users
http://localhost:3000/api/login
```

<image width="360px" src="./.readme/login-swagger.png"/>

Efetue login copie o access_token gerado:

```json
{
  "user": {
    "id": "0a177967-4161-4ad8-8c6d-02b8b22deaee",
    "email": "urban@shaves.com",
    "name": "urban",
    "avatarFileName": null,
    "created_at": 1651823528429,
    "updated_at": 1651823528429
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ZmNiZTI4NS03Y2QzLTQxZjItOGQ4YS1kNWFhMDA3MWE3MDQiLCJlbWFpbCI6InRlc3RlQHRlc3RlLmNvbSIsIm5hbWUiOiJ0ZXN0ZSIsImlhdCI6MTY1MTAwOTYzMywiZXhwIjoxNjUzNjAxNjMzfQ.9D_7gjQ96aRYYahZVZQqQLgEpD699YOkhKozy6EYgsA"
}
```

E cole no campo Authorize:

<image width="360px" src="./.readme/authorize.example.png"/>

## Prisma Studio

Para gravar e apagar dados manualmente no banco de dados, utilize o prisma studio:

```bash
yarn prisma studio
```

## Testes de integração

Utilizamos o jest para realizar testes de integração.
Eles simulam melhor o ambiente real para testar os casos de uso. Para isso criamos o arquivo <strong>.env.test</strong> com um database <strong>test</strong>.

```bash
#url de teste
DATABASE_URL="postgresql://dbase:dbase@localhost:5432/test?schema=public"
```

Na criação do banco de dados ocorrem os seguintes passos:

- [x] Criação do container com o banco de dados postgres com docker-compose
- [x] Criação da tabela de desenvolvimento e execução migration de desenvolvimento.
- [x] Criação da tabela test com e execução da migration de teste

Basta digitar:

```
yarn up:db
```

Para execução dos testes:

```bash
yarn test:watch -- nome_do_arquivo_de_teste
```

com isso os testes são realizados em um database de teste, diferente do database de desenvolvimento.
O banco de teste é resetado no inicio do teste, ao final.

```typescript
afterAll(async () => {
  const deleteAppointments = prisma.appointments.deleteMany();

  const deleteUsers = prisma.user.deleteMany();

  await prisma.$transaction([deleteAppointments, deleteUsers]);

  await prisma.$disconnect();
});
```

## **💥 Considerações**

Existem muitas vantagens na utilização do Nestjs para criação de APIs pelo fato dele respeitar os principios do <strong>SOLID</strong>. Desta forma é mais facil ecalar o projeto e o trabalho em grupo pelo fato deste framework usar uma aquitetura padronizada.

## **👨‍🚀 Autor**

<a href="https://github.com/tpaphysics">
<img alt="Thiago Pacheco" src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/46402647?v=4?v=4&h=300&w=300&fit=cover&mask=circle&maxage=7d" width="100px"/>
  <br />
  <sub>
    <b>Thiago Pacheco de Andrade</b>
  </sub>
</a>
<br />
  
👋 Meus contatos!
  
[![Linkedin Badge](https://img.shields.io/badge/-LinkedIn-blue?style=for-the-badge&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/thiago-pacheco-200a1a86/ )](https://www.linkedin.com/in/thiago-pacheco-200a1a86/)
[![Gmail Badge](https://img.shields.io/badge/-Gmail-c14438?style=for-the-badge&logo=Gmail&logoColor=white&link=mailto:physics.posgrad.@gmail.com )](mailto:physics.posgrad.@gmail.com)
  
##  Licença
  
  
Veja o arquivo [MIT license](LICENSE ).
