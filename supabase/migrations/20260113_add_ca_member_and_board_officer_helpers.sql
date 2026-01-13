-- Migration: create helper functions for CA membership and board officers
-- Date: 2026-01-13

-- 1) Create helper to detect CA membership (role 'ca_member')
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

-- 2) Create helper to detect board officers (president/treasurer/secretary)
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
