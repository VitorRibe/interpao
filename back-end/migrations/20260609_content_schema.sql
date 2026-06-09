-- SQL Migration for Learning Content
-- Date: 2026-06-09

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS setor (
    id_setor UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS trilha (
    id_trilha UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo TEXT NOT NULL,
    descricao TEXT,
    carga_hor INTEGER,
    id_setor UUID REFERENCES setor(id_setor),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS modulo (
    id_modulo UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_trilha UUID REFERENCES trilha(id_trilha) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    descricao TEXT,
    conteudo TEXT,
    duracao INTEGER,
    ordem INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS multimidia (
    id_multimidia UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_modulo UUID REFERENCES modulo(id_modulo) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    url TEXT,
    tipo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_trilha (
    user_id UUID REFERENCES "user"(id) ON DELETE CASCADE,
    id_trilha UUID REFERENCES trilha(id_trilha) ON DELETE CASCADE,
    PRIMARY KEY (user_id, id_trilha)
);

CREATE TABLE IF NOT EXISTS user_modulo (
    user_id UUID REFERENCES "user"(id) ON DELETE CASCADE,
    id_modulo UUID REFERENCES modulo(id_modulo) ON DELETE CASCADE,
    concluido BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id, id_modulo)
);

ALTER TABLE "user" ADD COLUMN IF NOT EXISTS id_setor UUID REFERENCES setor(id_setor);
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS cargo TEXT;

ALTER TABLE trilha ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now();
ALTER TABLE trilha ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
ALTER TABLE modulo ADD COLUMN IF NOT EXISTS ordem INTEGER;
ALTER TABLE modulo ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now();
ALTER TABLE modulo ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
ALTER TABLE multimidia ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now();
ALTER TABLE multimidia ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'trilha_id_setor_fkey') THEN
        ALTER TABLE trilha ADD CONSTRAINT trilha_id_setor_fkey FOREIGN KEY (id_setor) REFERENCES setor(id_setor);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'modulo_id_trilha_fkey') THEN
        ALTER TABLE modulo ADD CONSTRAINT modulo_id_trilha_fkey FOREIGN KEY (id_trilha) REFERENCES trilha(id_trilha) ON DELETE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'multimidia_id_modulo_fkey') THEN
        ALTER TABLE multimidia ADD CONSTRAINT multimidia_id_modulo_fkey FOREIGN KEY (id_modulo) REFERENCES modulo(id_modulo) ON DELETE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_trilha_user_id_fkey') THEN
        ALTER TABLE user_trilha ADD CONSTRAINT user_trilha_user_id_fkey FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_trilha_id_trilha_fkey') THEN
        ALTER TABLE user_trilha ADD CONSTRAINT user_trilha_id_trilha_fkey FOREIGN KEY (id_trilha) REFERENCES trilha(id_trilha) ON DELETE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_modulo_user_id_fkey') THEN
        ALTER TABLE user_modulo ADD CONSTRAINT user_modulo_user_id_fkey FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_modulo_id_modulo_fkey') THEN
        ALTER TABLE user_modulo ADD CONSTRAINT user_modulo_id_modulo_fkey FOREIGN KEY (id_modulo) REFERENCES modulo(id_modulo) ON DELETE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_id_setor_fkey') THEN
        ALTER TABLE "user" ADD CONSTRAINT user_id_setor_fkey FOREIGN KEY (id_setor) REFERENCES setor(id_setor);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_trilha_setor ON trilha(id_setor);
CREATE INDEX IF NOT EXISTS idx_modulo_trilha ON modulo(id_trilha);
CREATE INDEX IF NOT EXISTS idx_multimidia_modulo ON multimidia(id_modulo);
