-- Migration: work schedule (escala) table
-- Date: 2026-06-11

CREATE TABLE IF NOT EXISTS escala_item (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    -- 0=Segunda, 1=Terça, 2=Quarta, 3=Quinta, 4=Sexta, 5=Sábado, 6=Domingo
    dia_semana SMALLINT NOT NULL CHECK (dia_semana >= 0 AND dia_semana <= 6),
    folga BOOLEAN NOT NULL DEFAULT FALSE,
    entrada VARCHAR,
    saida VARCHAR,
    intervalo_min INTEGER NOT NULL DEFAULT 60,
    turno VARCHAR,
    notas TEXT,
    CONSTRAINT uq_escala_user_dia UNIQUE (user_id, dia_semana)
);

CREATE INDEX IF NOT EXISTS idx_escala_item_user_id ON escala_item (user_id);
