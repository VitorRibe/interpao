---
description: Como rodar o projeto Inter Pão localmente usando Docker
---

# 🚀 Fluxo de Inicialização do Projeto

Siga estes passos para colocar o sistema Inter Pão em funcionamento:

1. **Clone o repositório** (se ainda não o fez):
```bash
git clone git@github.com:VitorRibe/interpao.git
cd interpao
```

2. **Crie a rede necessária para os containers**:
// turbo
```bash
docker network create interpao-network || true
```

3. **Inicie os serviços do Supabase**:
// turbo
```bash
docker compose -f docker/docker-compose-supabase.yml up -d
```

4. **Inicie os serviços da aplicação (Front e Back)**:
// turbo
```bash
docker compose up -d --build
```

---

## 🏁 Verificação

Uma vez que os comandos acima terminarem, você deve conseguir acessar:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Documentação da API**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Dashboard Supabase**: [http://localhost:8080](http://localhost:8080)
