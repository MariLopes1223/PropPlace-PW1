# PropPlace-PW1

## API para gerenciar imóveis para aluguel

Esta API foi desenvolvida com objetivo de gerenciar imóveis disponíveis para aluguel. O usuário faz seu cadastro, registra um imóvel e pode associar imagens a esse imóvel após upload. A autenticação permite que apenas usuários autenticados possam acessar certas funcionalidades e fazer operações que alteram o banco de dados, enquanto algumas informações são públicas e somente leitura para usuários não autenticados. Também há a função de filtrar imóveis a partir de sua distância de uma coordenada dada pelo usuário.

### 1. Pré-requisitos

Após clonar o repositório com, certifique-se de ter Node.js e npm instalados em seu sistema. Você também precisa instalar os pacotes necessários usando o seguinte comando:

```bash
git clone https://github.com/MariLopes1223/PropPlace-PW1.git
cd ./PropPlace-PW1
npm install
```

### 2. Crie um arquivo .env

Copie [`.env.example`](./.env.example).env.example em um .env e preencha com suas variáveis de ambiente

```bash
cp ./.env.example ./.env
```

### 3. Crie e semeie o banco de dados

Execute o seguinte comando para criar seu arquivo de banco de dados SQLite.

```bash
npx prisma migrate dev --name init
```

Quando `npx prisma Migrate dev` é executado em um banco de dados recém-criado, a propagação também é acionada. O arquivo seed em [`prisma/seed.ts`](./prisma/seed.ts) será executado e seu banco de dados será preenchido com os dados de amostra.

### 4. Inicie o servidor com a API REST

```bash
npm start
```

O servidor está em execução e está apto a receber requisições.

Exepmlo:
Uma requisição POST `http://localhost:3000/users/login` com o seguinte Body:

```json
{
    "username": "admin123",
    "senha": "admin321"
}
```

Deve responder com um login bem sucedido:

```json
{
    "message": "sucesso",
    "token": "exemplo de token jwt Bearer"
}
```
