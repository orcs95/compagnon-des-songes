-- =============================================
-- O.R.C.S - Row Level Security Policies
-- Run this AFTER schema.sql
-- =============================================

-- =============================================
-- PROFILES POLICIES
-- =============================================

-- Anyone can view active member profiles
CREATE POLICY "Public can view active profiles"
ON public.profiles FOR SELECT
USING (membership_status = 'active');

-- Users can view their own profile regardless of status
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Admins can update any profile
CREATE POLICY "Admins can update any profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

-- =============================================
-- USER_ROLES POLICIES
-- =============================================

-- Users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins can view all roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Only admins can insert roles
CREATE POLICY "Admins can insert roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

-- Only admins can update roles
CREATE POLICY "Admins can update roles"
ON public.user_roles FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Only admins can delete roles
CREATE POLICY "Admins can delete roles"
ON public.user_roles FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- =============================================
-- BOARD_MEMBERS POLICIES
-- =============================================

-- Anyone can view active board members
CREATE POLICY "Public can view active board members"
ON public.board_members FOR SELECT
USING (is_active = true);

-- Admins can manage board members
CREATE POLICY "Admins can insert board members"
ON public.board_members FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update board members"
ON public.board_members FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete board members"
ON public.board_members FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- =============================================
-- EVENTS POLICIES
-- =============================================

-- Anyone can view events
CREATE POLICY "Public can view events"
ON public.events FOR SELECT
USING (true);

-- Admins and board members can create events
CREATE POLICY "Admins can create events"
ON public.events FOR INSERT
TO authenticated
WITH CHECK (
    public.is_admin(auth.uid()) OR 
    public.is_board_member(auth.uid())
);

-- Admins and event creators can update events
CREATE POLICY "Admins and creators can update events"
ON public.events FOR UPDATE
TO authenticated
USING (
    public.is_admin(auth.uid()) OR 
    created_by = auth.uid()
);

-- Admins can delete events
CREATE POLICY "Admins can delete events"
ON public.events FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- =============================================
-- EVENT_REGISTRATIONS POLICIES
-- =============================================

-- Users can view their own registrations
CREATE POLICY "Users can view own registrations"
ON public.event_registrations FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins and event creators can view all registrations for their events
CREATE POLICY "Admins can view all registrations"
ON public.event_registrations FOR SELECT
TO authenticated
USING (
    public.is_admin(auth.uid()) OR
    EXISTS (
        SELECT 1 FROM public.events 
        WHERE id = event_id AND created_by = auth.uid()
    )
);

-- Active members can register for events
CREATE POLICY "Active members can register"
ON public.event_registrations FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND membership_status = 'active'
    )
);

-- Users can update their own registrations
CREATE POLICY "Users can update own registrations"
ON public.event_registrations FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Users can delete their own registrations
CREATE POLICY "Users can delete own registrations"
ON public.event_registrations FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- =============================================
-- KEYS POLICIES
-- =============================================

-- Anyone can view key status
CREATE POLICY "Public can view keys"
ON public.keys FOR SELECT
USING (true);

-- Only board members can update keys
CREATE POLICY "Board members can update keys"
ON public.keys FOR UPDATE
TO authenticated
USING (public.is_board_member(auth.uid()));

-- =============================================
-- KEY_TRANSFERS POLICIES
-- =============================================

-- Board members and admins can view transfers
CREATE POLICY "Board members can view transfers"
ON public.key_transfers FOR SELECT
TO authenticated
USING (
    public.is_board_member(auth.uid()) OR 
    public.is_admin(auth.uid())
);

-- Board members can create transfer requests
CREATE POLICY "Board members can create transfers"
ON public.key_transfers FOR INSERT
TO authenticated
WITH CHECK (public.is_board_member(auth.uid()));

-- Recipients can confirm transfers
CREATE POLICY "Recipients can confirm transfers"
ON public.key_transfers FOR UPDATE
TO authenticated
USING (to_user_id = auth.uid() AND confirmed = false);

-- =============================================
-- EMAIL_WHITELIST POLICIES
-- =============================================

-- Only admins can view whitelist
CREATE POLICY "Admins can view whitelist"
ON public.email_whitelist FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Only admins can manage whitelist
CREATE POLICY "Admins can insert whitelist"
ON public.email_whitelist FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete whitelist"
ON public.email_whitelist FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));
