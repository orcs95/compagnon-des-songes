-- Migration: add 'ca_member' role and helper functions
-- Date: 2026-01-13

-- 1) Add new app_role value 'ca_member' if not present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'app_role' AND e.enumlabel = 'ca_member'
  ) THEN
    ALTER TYPE public.app_role ADD VALUE 'ca_member';
  END IF;
END$$;

-- 2) Helper functions are created in a separate migration to avoid "unsafe use" errors.
-- See: supabase/migrations/20260113_add_ca_member_and_board_officer_helpers.sql

-- End migration
