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

-- 2) Create helper to detect CA membership (role 'ca_member')
CREATE OR REPLACE FUNCTION public.is_ca_member(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'ca_member'::public.app_role
  );
$$;

-- 3) Create helper to detect board officers (president/treasurer/secretary)
CREATE OR REPLACE FUNCTION public.is_board_officer(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.board_members
    WHERE user_id = _user_id
      AND is_active = true
      AND board_role IN ('president'::public.board_role, 'treasurer'::public.board_role, 'secretary'::public.board_role)
  );
$$;

-- End migration
