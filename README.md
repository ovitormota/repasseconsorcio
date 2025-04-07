# Repasse Consórcio

Plataforma completa de leilão de consórcios de veículos, oferecendo uma solução eficiente para a gestão e negociação de cotas.

## Tecnologias Utilizadas
- **Backend**: Spring Boot (Java)
- **Frontend**: React
- **Banco de Dados**: PostgreSQL
- **Autenticação**: Spring Security + JWT
- **Containerização**: Docker & Docker Compose

## Configuração e Execução
Antes de iniciar, instale os seguintes requisitos:
- [Node.js](https://nodejs.org/)
- [Java 11+](https://adoptium.net/)
- [Docker](https://www.docker.com/) (opcional para PostgreSQL)

### Passos para iniciar o projeto
1. Instalar dependências do frontend e backend:
   ```sh
   npm install
   ./mvnw clean install
   ```
2. Iniciar o backend:
   ```sh
   ./mvnw
   ```
3. Iniciar o frontend:
   ```sh
   npm start
   ```
4. Acessar a aplicação:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend (API)**: [http://localhost:8080](http://localhost:8080)

### Executando com Docker (Opcional)
Para rodar o PostgreSQL via Docker:
```sh
docker-compose -f src/main/docker/postgresql.yml up -d
```
Para executar toda a aplicação conteinerizada:
```sh
docker-compose -f src/main/docker/app.yml up -d
```

## Contribuição
Para contribuir, abra um **pull request** ou relate problemas na aba de **issues**.

