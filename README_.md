<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>
  
[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest
  
  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<img src="https://img.shields.io/badge/yarn-%232C8EBB.svg?style=for-the-badge&logo=yarn&logoColor=white" alt="yarn" />
  
<img src="https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJs" />
  
<img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma.io" />
  
<img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  
<img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" alt="Prisma" />
  
<img src="https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white" alt="Prisma" />
  
##  Descrição
  
  
Nessa postagem criamos uma API Rest com CRUD de usários juntamente com fluxo de autenticação JWT utilizando o framework [Nest](https://nestjs.com/ ). Desta forma podemos criar, deletar, pesquisar e atualizar uma tabela de usuários no banco de dados. Usamos também o [Prisma](https://www.prisma.io/ ) como ORM e criamos um container com o banco de dados postgres usando o [Docker Compose](https://docs.docker.com/compose/ ).
  
##  Instalação
  
  
```bash
# Instalação das dependências
$ yarn
  
# Iniciar container com banco de dados postgress (Você precisa ter o docker instalado!):
$ yarn up:db
  
# Migração dos models definidos no schema.prisma para o banco de dados
$ yarn prisma migrate dev
```
  
##  Iniciando o servidor
  
  
```bash
# development
$ yarn start
  
# watch mode
$ yarn start:dev
  
# production mode
$ yarn start:prod
```
  
##  Observação
  
  
```bash
# Para remover o container criado:
$ yarn rm:db
```
  
Para que a API funcione você deve criar alguns usuários no banco de dados. Você pode usar algum cliente http como postman, insomnia, ou usar o prisma studio:
  
```bash
$ yarm prisma studio
```
  
Após o usuário enviar uma uma requisição do tipo post para a rota <strong>/login</strong> com body do tipo:
  
```json
{
  "email": "teste@teste.com",
  "password": "1Teste"
}
```
  
Recebemos como resposta:
  
```json
{
  "user": {
    "id": "8fcbe285-7cd3-41f2-8d8a-d5aa0071a704",
    "email": "teste@teste.com",
    "name": "teste",
    "age": 32,
    "gender": "masculine",
    "avatarFileName": null,
    "createdAt": "2022-04-26T21:46:48.318Z",
    "updateAt": "2022-04-26T21:46:48.318Z"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ZmNiZTI4NS03Y2QzLTQxZjItOGQ4YS1kNWFhMDA3MWE3MDQiLCJlbWFpbCI6InRlc3RlQHRlc3RlLmNvbSIsIm5hbWUiOiJ0ZXN0ZSIsImlhdCI6MTY1MTAwOTYzMywiZXhwIjoxNjUzNjAxNjMzfQ.9D_7gjQ96aRYYahZVZQqQLgEpD699YOkhKozy6EYgsA"
}
```
  
##  Rotas
  
  
Confira a documentação criada com Swagger, copie e cole a rota abaixo em seu navegador
  
```url
http://localhost:3000/api/users
```
  
  <img alt="swagger" width="450px" src="./.readme/swagger.png"/>
  
O decorator @IsPublicRoute(), torna as rotas do users.controllers públicas. Todas as rotas foram definidas como públicas.<strong> Retire o decorator @IsPublicRoute() no modo de produção</strong>
  
```typescript
  
//Retire o decorator @IsPublicRoute() no modo de produção
@IsPublicRoutes()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @ApiTags('create new user')
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }
```
  
##  Upload de imagens com o multer
  
  
No médodo <strong>update</strong> conseguimos fazer uploads de imagens para pasta <strong>upload</strong> no diretório corrente do projeto. O multer foi configurado no arquivo <strong>multer-config.ts</strong>. Para entender a integração do multer com NestJs basta ler a [documentação](https://docs.nestjs.com/techniques/file-upload ). Abaixo configuramos o multer para filtar arquivos de imagens com extensões jpeg, jpg e png com tamanho máximo defindo no arquivo .env na variável AVATAR_SIZE_FILE.
  
```typescript
// multer-config.js
  
import { Injectable, UnsupportedMediaTypeException } from '@nestjs/common';
import { randomBytes } from 'crypto';
  
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
  
@Injectable()
export default class MulterConfigService implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: './upload',
        filename: (_req, file, cb) => {
          const { mimetype } = file;
          const [, extension] = mimetype.split('/', 2);
          const fileHashName = randomBytes(16).toString('hex');
          const name = `${fileHashName}.${extension}`;
          return cb(null, name);
        },
      }),
      limits: { fileSize: Number(process.env.AVATAR_SIZE_FILE) * 1024 * 1024 },
      fileFilter: (
        _req: any,
        file: Express.Multer.File,
        cb: (error: Error | null, acceptFile: boolean) => void,
      ) => {
        if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new UnsupportedMediaTypeException(
              'Only use jpg jpeg or png files!',
            ),
            false,
          );
        }
      },
    };
  }
}
```
  
##  Paginação usando o Prisma
  
  
Implementamos um sistema de paginação do tipo offset utilizando o Prisma no arquivo <strong>user.service.ts</strong>
  
```typescript
// user.service.ts
  
async findAll(query: findAllUserDto): Promise<FindAllUserResponse> {
    const { page, take } = query;
  
    const totalUsers = await this.prisma.user.count();
  
    if (!totalUsers || totalUsers == 0) {
      throw new InternalServerErrorException('Not found users!');
    }
  
    if (take > totalUsers) {
      throw new BadRequestException('Invalid number of users!');
    }
  
    const totalPages = Math.ceil(totalUsers / take);
  
    if (page > totalPages) {
      throw new BadRequestException(
        `Maximum number of pages are ${totalPages}!`,
      );
    }
  
    const users = await this.prisma.user.findMany({
      skip: (page - 1) * take,
      take,
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        gender: true,
        avatarFileName: true,
        password: false,
        createdAt: true,
        updateAt: true,
      },
    });
  
    return {
      paginate: {
        page: page,
        totalPages,
      },
      users: [...users],
    };
  }
```
  
<strong>skip</strong>: Número de resultados a serem ignordos
<br/>
<strong>take</strong>: Número de resultados retornados após o skip
  
De maneira intuitiva, temos:
  
```
page > 0
skip=(page-1)take
```
  
Enviamos esses parâmatros para o backend através dos query params em uma requisição do tipo get.
  
```url
http://localhost:3000/users?page=1&take=2
```
  
E eles são validados no findAll-user.dto.ts como sendo do tipo númerico, inteiro e maior que 0
  
```typescript
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
import { User } from '../entities/user.entity';
  
export class findAllUserDto extends User {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;
  
  @Type(() => Number)
  @IsInt()
  @Min(1)
  take: number;
```
  
##  **💥 Considerações**
  
  
Existem muita vatagens na utilização do NestJs para criação de APIs uma delas é o fato dele respeitar os principios do <strong>SOLID</strong>. Desta forma forma fica mais facil o trabalho em grupo com uma aquitetura padrão definida. O NestJs usa uma aquitetura muito semelhante a do framework [Angular](https://angular.io/ ), com uso de classes extendidas e decorators. Particularmente achei bem elegante o uso da biblioteca [class-validator](https://www.npmjs.com/package/class-validator ) para validação de campos através de decorators nos Data Transfer Objects (DTOs) :
  
```typescript
import { User } from '../entities/user.entity';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
  
export class CreateUserDto extends User {
  @IsString()
  @IsEmail()
  email: string;
  
  @IsString()
  @Matches(/[a-zA-Z0-9_-]{2,20}/)
  name: string;
  
  @MinLength(6)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak!',
  })
  password: string;
  
  @IsInt()
  @Min(1)
  @Max(120)
  age: number;
  
  @IsString()
  @IsIn(['masculine', 'feminine'])
  gender: string;
}
```
  
Isso contribiu para um código _clean_ e escalável. Outro fator interressante é o tratamento de erros de forma global através da utilização de middlewares. Existem inumeras outras vantagens na utilização NestJs, ele pode ser usados para a criação de microserviços,serveless, etc... Para mais informações, consulte a documentação do [NestJs](https://nestjs.com/ ).
  
##  **👨‍🚀 Autor**
  
  
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
  