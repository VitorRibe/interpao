# 🥖 Inter Pão

> Sistema de apoio ao treinamento de novos funcionários da Inter Pão.

Este projeto utiliza uma arquitetura moderna com **FastAPI** no back-end, **React (Vite)** no front-end e **Supabase** para banco de dados e autenticação, tudo orquestrado via **Docker**.

---

## 🛠️ Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:
- [Git](https://git-scm.com)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

## 🚀 Como Rodar o Projeto

Siga os passos abaixo para configurar o ambiente de desenvolvimento:

### 1. Clonar o Repositório
```bash
git clone git@github.com:VitorRibe/interpao.git
cd interpao
```

### 2. Criar a Rede do Docker
```bash
docker network create interpao-network
```

### 3. Subir o Supabase (Banco de Dados & Auth)
```bash
docker compose -f docker/docker-compose-supabase.yml up -d
```

### 4. Subir a Aplicação (Front-end & Back-end)
```bash
docker compose up -d --build
```

---

## 🔗 Links de Acesso

Após a inicialização, você poderá acessar os serviços nos seguintes endereços:

| Serviço | URL | Descrição |
| :--- | :--- | :--- |
| **Frontend** | [http://localhost:3000](http://localhost:3000) | Interface do usuário (React) |
| **API Docs** | [http://localhost:8000/docs](http://localhost:8000/docs) | Documentação Swagger da API |
| **Supabase** | [http://localhost:8080](http://localhost:8080) | Painel de controle do Supabase |

---

## 🏗️ Estrutura do Projeto

- `/back-end`: Código fonte da API (Python/FastAPI).
- `/front-end`: Código fonte da interface (TypeScript/React).
- `/docker`: Configurações adicionais de infraestrutura.
