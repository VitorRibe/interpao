-- SQL Migration for Recipes
-- Date: 2026-06-10

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS ingrediente (
    id_ingr UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    unidade_med TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS receita (
    id_receita UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo TEXT NOT NULL,
    descricao TEXT,
    inst_preparo TEXT,
    image_url TEXT,
    tempo_preparo INTEGER,
    porcoes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS item_receita (
    id_receita UUID NOT NULL,
    id_ingr UUID NOT NULL,
    qtd NUMERIC(10,3) NOT NULL,
    PRIMARY KEY (id_receita, id_ingr)
);

CREATE TABLE IF NOT EXISTS setor_receita (
    id_setor UUID NOT NULL,
    id_receita UUID NOT NULL,
    PRIMARY KEY (id_setor, id_receita)
);

ALTER TABLE ingrediente ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();
ALTER TABLE ingrediente ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();
ALTER TABLE receita ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE receita ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();
ALTER TABLE receita ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();

DO $$
BEGIN
    ALTER TABLE item_receita
        ADD CONSTRAINT item_receita_id_receita_fkey
        FOREIGN KEY (id_receita) REFERENCES receita(id_receita) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER TABLE item_receita
        ADD CONSTRAINT item_receita_id_ingr_fkey
        FOREIGN KEY (id_ingr) REFERENCES ingrediente(id_ingr) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER TABLE setor_receita
        ADD CONSTRAINT setor_receita_id_setor_fkey
        FOREIGN KEY (id_setor) REFERENCES setor(id_setor) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER TABLE setor_receita
        ADD CONSTRAINT setor_receita_id_receita_fkey
        FOREIGN KEY (id_receita) REFERENCES receita(id_receita) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_item_receita_receita ON item_receita(id_receita);
CREATE INDEX IF NOT EXISTS idx_item_receita_ingrediente ON item_receita(id_ingr);
CREATE INDEX IF NOT EXISTS idx_setor_receita_setor ON setor_receita(id_setor);
CREATE INDEX IF NOT EXISTS idx_setor_receita_receita ON setor_receita(id_receita);
