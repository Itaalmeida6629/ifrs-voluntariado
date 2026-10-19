# IFRS Voluntariado

Sistema monolítico para gerenciamento de voluntários, eventos sociais e inscrições em eventos. O projeto utiliza Node.js, Express, MySQL e React, seguindo uma arquitetura em camadas no backend.

## Funcionalidades

- Login de usuários com JWT.
- Inicialização automática do primeiro administrador.
- Cadastro público de voluntários.
- Gerenciamento de voluntários por administradores.
- Consulta e atualização do próprio perfil.
- CRUD de eventos sociais.
- Inscrição e cancelamento de inscrições em eventos.
- Visualização de inscritos por administradores.
- Controle do limite de voluntários por evento.
- Tratamento centralizado de erros.
- Documentação interativa com Swagger UI.

## Tecnologias

- Node.js
- Express
- MySQL
- mysql2
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- helmet
- swagger-jsdoc
- swagger-ui-express
- React
- React Router
- Axios
- ESLint
- Prettier
- REST Client

## Estrutura

```text
backend/
  src/
    config/          Configuração do banco e inicialização do admin
    controllers/     Entrada e resposta das requisições
    middlewares/     Autenticação, autorização e erros
    models/          Operações no MySQL
    routes/          Endpoints da API
    services/        Regras de negócio
    utils/           Validações e utilitários
  tests/             Requisições REST Client
frontend/
  src/
    api/             Cliente Axios
    components/      Componentes reutilizáveis
    contexts/        Estado da autenticação
    pages/            Telas da aplicação
    styles/           Estilos globais
database/
  schema.sql          Banco, tabelas, triggers e dados fictícios
```

## Configuração

### Backend

Na pasta `backend`, instale as dependências:

```bash
npm install
```

Crie o arquivo `backend/.env` a partir do `.env.example`:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_DATABASE=voluntariados_db
JWT_SECRET=sua_chave_secreta
ADMIN_NAME=Administrador Inicial
ADMIN_EMAIL=admin@ifrs.edu.br
ADMIN_PASSWORD=uma_senha_com_no_minimo_6_caracteres
ADMIN_PHONE=54999999999
```

Crie o banco executando o script `database/schema.sql` no MySQL.

Inicie a API:

```bash
npm run dev
```

### Frontend

Na pasta `frontend`, instale as dependências:

```bash
npm install
```

Configure o arquivo `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

Inicie o frontend:

```bash
npm run dev
```

A aplicação ficará disponível em `http://localhost:5173`.

## Scripts

### Backend

```bash
npm run dev
npm start
npm run lint
npm run format
npm run format:check
npm run docs
```

### Frontend

```bash
npm run dev
npm run build
npm run lint
npm run format
npm run format:check
```

## Documentação da API

Com o backend em execução, acesse:

- Swagger UI: `http://localhost:3000/api-docs`
- Documento OpenAPI: `http://localhost:3000/openapi.json`
- Documentação interna JSDoc: gerada em `backend/docs/jsdoc` com `npm run docs`.

## Endpoints

### Autenticação e dashboard

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| POST | `/auth/login` | Público | Autentica um usuário e retorna um JWT |
| GET | `/dashboard` | Autenticado | Retorna informações do usuário autenticado |

### Voluntários e usuários

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| POST | `/volunteers` | Público | Cadastra um voluntário |
| GET | `/users` | Admin | Lista os usuários do sistema |
| GET | `/users/:id` | Admin ou próprio usuário | Busca um usuário |
| PUT | `/users/:id` | Admin ou próprio usuário | Atualiza um usuário |
| DELETE | `/users/:id` | Admin | Remove um usuário |

### Eventos

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| GET | `/events` | Público | Lista os eventos |
| GET | `/events/:id` | Público | Busca um evento |
| POST | `/events` | Admin | Cadastra um evento |
| PUT | `/events/:id` | Admin | Atualiza um evento |
| DELETE | `/events/:id` | Admin | Remove um evento |

### Inscrições

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| POST | `/events/:eventoId/volunteers` | Voluntário | Realiza uma inscrição |
| GET | `/events/:eventoId/volunteers` | Admin | Lista os inscritos de um evento |
| DELETE | `/events/:eventoId/volunteers/me` | Voluntário autenticado | Cancela a própria inscrição |

## Regras de negócio

- O cadastro público cria usuários com role `voluntario`.
- O administrador inicial é criado com os dados do `.env` quando não existe outro admin.
- Senhas são armazenadas com bcrypt.
- Senhas nunca são retornadas nas respostas da API.
- O JWT expira em uma hora e contém `userId`, `email` e `role`.
- Usuários comuns podem visualizar e atualizar apenas o próprio perfil.
- Apenas admins podem criar, alterar e remover eventos.
- Eventos aceitam os status `agendado` e `finalizado`.
- Eventos finalizados não aceitam novas inscrições.
- Um voluntário não pode se inscrever duas vezes no mesmo evento.
- O limite de voluntários é protegido pelo service e pelo trigger do banco.
- O período do evento deve possuir data final posterior à data inicial.

## Testes REST Client

Os exemplos de requisições estão em:

- `backend/tests/user.tests.rest`
- `backend/tests/event.tests.rest`
- `backend/tests/event_volunteer.tests.rest`

Execute primeiro os logins nos arquivos para preencher os tokens utilizados nas requisições protegidas.
