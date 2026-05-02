# 🚀 Exploring Node + Knex — API REST com Painel Administrativo e Site Público

> Projeto fullstack construído com **Node.js**, **Express 5**, **Knex.js** e **MySQL**, organizado em arquitetura monorepo com três aplicações independentes que se comunicam via API REST.

---

## 📌 Sobre o Projeto

Este projeto foi desenvolvido com o objetivo de explorar e aplicar conceitos modernos de desenvolvimento backend com Node.js. A aplicação é dividida em três partes independentes:

- **API REST** — backend central responsável pela lógica de negócio, autenticação e acesso ao banco de dados
- **Painel Admin** — interface web para gerenciamento de usuários e conteúdo
- **Site Público** — frontend que consome a API e exibe as informações ao usuário final

A comunicação entre o painel admin, o site e a API é feita inteiramente via **HTTP com `node-fetch`**, simulando um ambiente real de microsserviços desacoplados.

---

## 🗂️ Estrutura do Projeto

```
exploring-node-knex/
└── exploring-api/
    └── apps/
        ├── api/               # 🔧 API REST (porta 3000)
        │   ├── controllers-api/
        │   │   ├── admin-controllers.js
        │   │   └── website-controllers.js
        │   ├── database/
        │   │   ├── db-connection.js
        │   │   └── db_test_api.sql
        │   ├── middlewares/
        │   │   └── auth-jwt.js
        │   ├── multer/
        │   │   ├── multer-config.js
        │   │   └── multer-config-content.js
        │   ├── routes-api/
        │   │   ├── admin-routes.js
        │   │   └── website-routes.js
        │   ├── uploads/
        │   ├── uploads-content/
        │   ├── .env
        │   ├── package.json
        │   └── server.js
        │
        ├── admin/             # 🖥️ Painel Administrativo (porta 3001)
        │   ├── controllers/
        │   │   └── admin-controllers.js
        │   ├── middlewares/
        │   │   └── middleware-auth.js
        │   ├── routes/
        │   │   └── admin-routes.js
        │   ├── views/
        │   │   ├── includes/
        │   │   │   ├── footer.ejs
        │   │   │   └── sidebar.ejs
        │   │   └── pages/
        │   │       ├── index.ejs
        │   │       ├── login/login.ejs
        │   │       ├── register-info/register.ejs
        │   │       ├── send-post/post.ejs
        │   │       └── admin-manage/admin-user.ejs
        │   ├── public/
        │   │   ├── js/
        │   │   │   ├── post.js
        │   │   │   └── sidebar.js
        │   │   ├── input.css
        │   │   └── output.css
        │   ├── package.json
        │   └── app.js
        │
        └── site/              # 🌐 Site Público (porta 3002)
            ├── controllers/
            │   └── site-controllers.js
            ├── routes/
            │   └── site-routes.js
            ├── views/
            │   ├── includes/
            │   │   ├── card.ejs
            │   │   └── navbar.ejs
            │   └── pages/
            │       ├── site.ejs
            │       └── details-post/details.ejs
            ├── public/
            │   ├── css/
            │   └── js/
            │       └── scriptSearch.js
            ├── package.json
            └── app.js
```

---

## 🧰 Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js (ESModules) |
| Framework | Express 5 |
| Query Builder | Knex.js |
| Banco de Dados | MySQL (via mysql2) |
| Autenticação | JSON Web Token (JWT) |
| Upload de Arquivos | Multer |
| Export de Dados | ExcelJS |
| Template Engine | EJS |
| Estilização | Tailwind CSS 4 |
| Comunicação entre apps | node-fetch |
| Sessões | express-session |
| Dev server | Nodemon |

---

## 🏗️ Arquitetura

```
┌─────────────────┐        HTTP/fetch        ┌─────────────────────┐
│  Admin (3001)   │ ──────────────────────►  │                     │
│  EJS + Session  │                          │   API REST (3000)   │
└─────────────────┘                          │   Express + Knex    │
                                             │   JWT + MySQL       │
┌─────────────────┐        HTTP/fetch        │                     │
│  Site  (3002)   │ ──────────────────────►  │                     │
│  EJS + Search   │                          └─────────┬───────────┘
└─────────────────┘                                    │
                                                       │ Knex.js
                                              ┌────────▼────────┐
                                              │   MySQL (db_admin) │
                                              └─────────────────┘
```

A API é o único ponto de acesso ao banco de dados. As outras aplicações se comportam como **clientes HTTP**, o que garante separação de responsabilidades e facilita escalabilidade futura.

---

## 🗄️ Modelagem do Banco de Dados

O banco `db_admin` possui três tabelas com relacionamentos bem definidos:

```sql
adminApp
├── id_admin  INT  AUTO_INCREMENT  PK
├── userName  VARCHAR(50)
└── userPassword  VARCHAR(50)

infoUsers
├── id         INT  AUTO_INCREMENT  PK
├── id_admin   INT  FK → adminApp(id_admin)  ON DELETE CASCADE
├── userImg    VARCHAR(255)
├── nome       VARCHAR(100)
├── email      VARCHAR(100)
└── slug       VARCHAR(100)

content_post
├── id_post           INT  AUTO_INCREMENT  PK
├── id_card           INT  FK → infoUsers(id)  ON DELETE CASCADE
├── type_content      VARCHAR(50)   -- "text" | "title" | "image"
├── content           TEXT
├── position_content  INT
└── image             VARCHAR(255)
```

Os relacionamentos utilizam `ON DELETE CASCADE`, garantindo integridade referencial automática.

---

## 🔐 Autenticação e Segurança

O sistema utiliza uma **dupla camada de autenticação**:

### 1. Sessão no Admin (`express-session`)
O painel admin autentica o administrador via sessão do servidor. O middleware `middlewareAuthAdmin` protege todas as rotas privadas:

```js
export function middlewareAuthAdmin(req, res, next){
    if(!req.session.admin){
        return res.redirect("/admin/admin-login");
    }
    next();
}
```

### 2. JWT na API (`jsonwebtoken`)
A API gera um token JWT na rota de login com expiração de **10 minutos**. Todas as rotas administrativas da API exigem o token via `Authorization: Bearer <token>`:

```js
export function middlewareAuthJwt(req, res, next){
    const token = req.headers['authorization']?.split(' ')[1];
    if(!token) return res.status(401).json({ message: "Token não autorizado" });

    const decoded = jwt.verify(token, JWT_SECRET);
    req.adminToken = decoded.id;
    next();
}
```

O fluxo completo:
1. Admin faz login no painel → painel chama `POST /api/admin/admin-login`
2. API valida as credenciais e retorna o **JWT**
3. O token é armazenado na **session** do painel
4. Cada requisição subsequente do painel envia o token no header `Authorization`
5. O middleware da API valida o token antes de executar qualquer operação

---

## 📡 Endpoints da API

### 🔒 Rotas Administrativas — `/api/admin`

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `POST` | `/admin-login` | ❌ | Autenticação do admin, retorna JWT |
| `GET` | `/manage-user` | ✅ JWT | Lista todos os usuários do admin logado |
| `POST` | `/register-user` | ✅ JWT | Cadastra novo usuário com upload de imagem |
| `DELETE` | `/manage-user/:id` | ✅ JWT | Remove um usuário pelo ID |
| `POST` | `/post/:postId/content` | ✅ JWT | Adiciona conteúdo (texto, título ou imagem) a um post |
| `GET` | `/export-data` | ✅ JWT | Exporta todos os usuários em arquivo `.xlsx` |

### 🌐 Rotas Públicas — `/api/site`

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `GET` | `/select-info` | ❌ | Retorna todos os usuários/cards |
| `GET` | `/content-post/:id` | ❌ | Retorna os detalhes e conteúdos de um post |
| `GET` | `/search?query=` | ❌ | Busca por nome ou email (case-insensitive) |

---

## 📤 Upload de Arquivos com Multer

O projeto conta com **dois pipelines de upload** separados:

`multer-config.js` — para imagens de perfil dos usuários, salvos em `/uploads`

`multer-config-content.js` — para imagens de conteúdo dos posts, salvos em `/uploads-content`

Ambos utilizam `diskStorage` com nomenclatura baseada em `Date.now()` para evitar colisões de nome:

```js
filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
}
```

As pastas são servidas como arquivos estáticos pela API:

```js
app.use("/uploads", express.static("uploads"));
app.use("/uploads-content", express.static("uploads-content"));
```

---

## 📊 Exportação de Dados para Excel

O admin pode exportar todos os registros de usuários para um arquivo `.xlsx` usando a biblioteca **ExcelJS**. As colunas são geradas dinamicamente com base nas chaves retornadas pelo banco:

```js
sheet.columns = Object.keys(rows[0]).map(key => ({
    header: key,
    key: key,
    width: 20
}));
```

O arquivo é transmitido diretamente na resposta HTTP, sem armazenar no servidor.

---

## 🔍 Busca com Knex.js

A API implementa busca case-insensitive por `nome` ou `email` usando `whereRaw` do Knex:

```js
query.where(function() {
    this.whereRaw('LOWER(nome) LIKE LOWER(?)', [termo])
        .orWhereRaw('LOWER(email) LIKE LOWER(?)', [termo]);
});
```

No frontend, a busca é feita via **fetch assíncrono** sem recarregar a página, atualizando os cards dinamicamente:

```js
buttonSearch.addEventListener("click", () => {
    searchUsers(searchInput.value.trim());
});
```

---

## ⚙️ Configuração e Execução

### Pré-requisitos

- Node.js 18+
- MySQL rodando localmente
- npm

### 1. Configure o banco de dados

Execute o script SQL no seu MySQL:

```bash
mysql -u root -p < apps/api/database/db_test_api.sql
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` em `apps/api/` com:

```env
JWT_SECRET=seu_secret_aqui
HOST=127.0.0.1
DB_USER=seu_usuario
PASSWORD=sua_senha
DB=db_admin
PORT=3000
```

### 3. Instale as dependências e rode cada app

```bash
# API
cd apps/api
npm install
npm run dev

# Admin (em outro terminal)
cd apps/admin
npm install
npm run dev

# Site (em outro terminal)
cd apps/site
npm install
npm run dev
```

### Portas utilizadas

| App | Porta |
|-----|-------|
| API REST | `3000` |
| Painel Admin | `3001` |
| Site Público | `3002` |

---

## 🔗 Conexão com o Banco via Knex

A conexão é centralizada em `database/db-connection.js` com **connection pooling** configurado:

```js
export const dbKnex = knex({
    client: "mysql2",
    connection: {
        host: process.env.HOST,
        user: process.env.DB_USER,
        password: process.env.PASSWORD,
        database: process.env.DB
    },
    pool: { min: 2, max: 10 }
});
```

Na inicialização, a API valida a conexão com `dbKnex.raw("SELECT 1")` antes de iniciar o servidor — evitando que a aplicação suba sem banco disponível.

---

## 💡 Conceitos Aplicados

- **Arquitetura em monorepo** com apps independentes e comunicação via HTTP
- **API REST** com separação clara de rotas públicas e protegidas
- **Autenticação em dois níveis**: JWT na API + Session no admin
- **Query Builder (Knex.js)** para consultas SQL tipadas e seguras sem ORM pesado
- **Upload de arquivos** com Multer e organização em diretórios distintos
- **Exportação de dados** para Excel com ExcelJS
- **Busca dinâmica** no frontend sem reload de página
- **ESModules** nativos no Node.js (`"type": "module"`)
- **Cascade delete** no banco para integridade referencial automática
- **Connection pooling** para eficiência nas queries

---

## 📦 Dependências Principais

### API
| Pacote | Versão | Uso |
|--------|--------|-----|
| express | ^5.1.0 | Framework web |
| knex | ^3.2.9 | Query builder SQL |
| mysql2 | ^3.20.0 | Driver MySQL |
| jsonwebtoken | ^9.0.3 | Autenticação JWT |
| multer | ^2.0.2 | Upload de arquivos |
| exceljs | ^4.4.0 | Exportação para Excel |
| dotenv | ^17.3.1 | Variáveis de ambiente |
| cors | ^2.8.5 | Cross-Origin Resource Sharing |

### Admin & Site
| Pacote | Versão | Uso |
|--------|--------|-----|
| express | ^5.1.0 | Framework web |
| ejs | ^3.1.10 | Template engine |
| express-session | ^1.18.2 | Sessões do servidor |
| node-fetch | ^3.3.2 | Requisições HTTP para a API |
| tailwindcss | ^4.1.18 | Estilização |

---

## 👨‍💻 Autor

**Paulo César**

[![GitHub](https://img.shields.io/badge/GitHub-PauloCesar26-black?style=flat&logo=github)](https://github.com/PauloCesar26)
