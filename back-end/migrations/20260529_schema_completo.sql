-- Interpao Database Schema (Supabase) - INCREMENTAL MIGRATION
-- Baseado no banco existente (20260507_auth_system.sql)
-- Date: 2026-05-29

-- 1. CRIAR EXTENSÕES (se não existir)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CRIAR TABELA SETOR PRIMEIRO (Necessário para a Foreign Key funcionar)
CREATE TABLE IF NOT EXISTS setor (
    id_setor UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL UNIQUE
);

CREATE INDEX IF NOT EXISTS idx_setor_nome ON setor(nome);

-- 3. ALTERAR TABELA USER EXISTENTE E REMOVER COMPANY
-- Desconecta e remove a coluna legada da company
ALTER TABLE "user" DROP CONSTRAINT IF EXISTS user_company_id_fkey;
ALTER TABLE "user" DROP COLUMN IF EXISTS company_id;

-- Adiciona os novos campos apontando para o setor
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS cargo TEXT;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS id_setor UUID REFERENCES setor(id_setor) ON DELETE SET NULL;

-- Remove a tabela company definitivamente
DROP TABLE IF EXISTS company CASCADE;

-- 4. CRIAR AS OUTRAS TABELAS INDEPENDENTES
CREATE TABLE IF NOT EXISTS receita (
    id_receita UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo TEXT NOT NULL,
    descricao TEXT,
    inst_preparo TEXT
);

CREATE TABLE IF NOT EXISTS ingrediente (
    id_ingr UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    unidade_med TEXT
);

CREATE TABLE IF NOT EXISTS trilha (
    id_trilha UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo TEXT NOT NULL,
    descricao TEXT,
    carga_hor INTEGER
);

-- 5. CRIAR TABELAS DEPENDENTES
CREATE TABLE IF NOT EXISTS modulo (
    id_modulo UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_trilha UUID NOT NULL REFERENCES trilha(id_trilha) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    descricao TEXT,
    conteudo TEXT,
    duracao INTEGER
);

CREATE INDEX IF NOT EXISTS idx_modulo_id_trilha ON modulo(id_trilha);

CREATE TABLE IF NOT EXISTS multimidia (
    id_multimidia UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_modulo UUID NOT NULL REFERENCES modulo(id_modulo) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    url TEXT,
    tipo TEXT
);

CREATE INDEX IF NOT EXISTS idx_multimidia_id_modulo ON multimidia(id_modulo);

-- 6. CRIAR TABELAS ASSOCIATIVAS (N:M)
CREATE TABLE IF NOT EXISTS item_receita (
    id_receita UUID NOT NULL REFERENCES receita(id_receita) ON DELETE CASCADE,
    id_ingr UUID NOT NULL REFERENCES ingrediente(id_ingr) ON DELETE CASCADE,
    qtd NUMERIC NOT NULL,
    PRIMARY KEY (id_receita, id_ingr)
);

CREATE TABLE IF NOT EXISTS setor_receita (
    id_setor UUID NOT NULL REFERENCES setor(id_setor) ON DELETE CASCADE,
    id_receita UUID NOT NULL REFERENCES receita(id_receita) ON DELETE CASCADE,
    PRIMARY KEY (id_setor, id_receita)
);

CREATE TABLE IF NOT EXISTS user_trilha (
    id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    id_trilha UUID NOT NULL REFERENCES trilha(id_trilha) ON DELETE CASCADE,
    PRIMARY KEY (id, id_trilha)
);

CREATE TABLE IF NOT EXISTS user_modulo (
    id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    id_modulo UUID NOT NULL REFERENCES modulo(id_modulo) ON DELETE CASCADE,
    concluido BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id, id_modulo)
);

CREATE TABLE IF NOT EXISTS trilha_setores (
    id_trilha UUID NOT NULL REFERENCES trilha(id_trilha) ON DELETE CASCADE,
    id_setor UUID NOT NULL REFERENCES setor(id_setor) ON DELETE CASCADE,
    PRIMARY KEY (id_trilha, id_setor)
);

CREATE TABLE IF NOT EXISTS multimidia_setores (
    id_multimidia UUID NOT NULL REFERENCES multimidia(id_multimidia) ON DELETE CASCADE,
    id_setor UUID NOT NULL REFERENCES setor(id_setor) ON DELETE CASCADE,
    PRIMARY KEY (id_multimidia, id_setor)
);

-- 7. INSERIR SETORES PADRÃO
INSERT INTO setor (nome) VALUES 
    ('Atendimento'),
    ('Produção'),
    ('Escritório'),
    ('Geral'),
    ('Administrador')
ON CONFLICT (nome) DO NOTHING;