-- SQL Migration for Authentication System (UUID Edition)
-- Date: 2026-05-07

-- 1. Enable UUID extension (if not using Postgres 13+)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Company table
CREATE TABLE IF NOT EXISTS company (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    image_url VARCHAR,
    status VARCHAR DEFAULT 'Active'
);

-- 3. Create User table
CREATE TABLE IF NOT EXISTS "user" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR UNIQUE NOT NULL,
    hashed_password VARCHAR NOT NULL,
    name VARCHAR,
    phone VARCHAR,
    image_url VARCHAR,
    is_active BOOLEAN DEFAULT TRUE,
    is_admin BOOLEAN DEFAULT FALSE,
    is_superuser BOOLEAN DEFAULT FALSE,
    company_id UUID REFERENCES company(id)
);

-- Add columns individually if table existed but was missing new fields
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS name VARCHAR;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS phone VARCHAR;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS image_url VARCHAR;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS is_superuser BOOLEAN DEFAULT FALSE;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES company(id);

-- 4. Create Session table
CREATE TABLE IF NOT EXISTS session (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create indexes
CREATE INDEX IF NOT EXISTS idx_session_user_id ON session(user_id);
CREATE INDEX IF NOT EXISTS idx_company_name ON company(name);
CREATE INDEX IF NOT EXISTS idx_user_email ON "user"(email);
