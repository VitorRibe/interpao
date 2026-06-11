-- Migration: add password_reset fields to user table
-- Date: 2026-06-11

ALTER TABLE "user" ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS password_reset_expires_at TIMESTAMPTZ;
