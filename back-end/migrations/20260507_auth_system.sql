-- SQL Migration for Authentication System
-- Date: 2026-05-07

-- Create Company table
CREATE TABLE IF NOT EXISTS company (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    image_url VARCHAR,
    status VARCHAR DEFAULT 'Active'
);

-- Update User table
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS name VARCHAR;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS phone VARCHAR;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS image_url VARCHAR;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS is_superuser BOOLEAN DEFAULT FALSE;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS company_id INTEGER REFERENCES company(id);

-- Create Session table
CREATE TABLE IF NOT EXISTS session (
    id VARCHAR PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_session_user_id ON session(user_id);
CREATE INDEX IF NOT EXISTS idx_company_name ON company(name);
