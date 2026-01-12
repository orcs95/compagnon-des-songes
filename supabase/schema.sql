-- =============================================
-- O.R.C.S - Ordre Rôlistique des Conteurs de Songes
-- Supabase Database Schema
-- =============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- ENUM TYPES
-- =============================================

-- Application roles
CREATE TYPE public.app_role AS ENUM ('admin', 'board_member', 'ca_member', 'member');

-- Board member specific roles
CREATE TYPE public.board_role AS ENUM ('president', 'treasurer', 'secretary', 'board_member');

-- Membership status
CREATE TYPE public.membership_status AS ENUM ('pending', 'active', 'inactive');

-- Event types
CREATE TYPE public.event_type AS ENUM ('jdr', 'board_game', 'mtg', 'other');

-- Registration status
CREATE TYPE public.registration_status AS ENUM ('registered', 'cancelled', 'waitlist');

-- Key status
CREATE TYPE public.key_status AS ENUM ('available', 'held');

-- =============================================
-- TABLES
-- =============================================

-- Profiles table (extends auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    membership_status public.membership_status DEFAULT 'pending'::public.membership_status,
    activities TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role public.app_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- Board members table
CREATE TABLE public.board_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    board_role public.board_role NOT NULL,
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, board_role, start_date)
);

-- Events table
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    event_type public.event_type NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    location TEXT DEFAULT 'Ludothèque de Saint-Brice-sous-Forêt',
    price DECIMAL(10, 2) DEFAULT 0,
    max_participants INTEGER,
    payment_link TEXT,
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern TEXT,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event registrations table
CREATE TABLE public.event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status public.registration_status DEFAULT 'registered'::public.registration_status,
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Keys table (exactly 2 keys)
CREATE TABLE public.keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key_number INTEGER NOT NULL UNIQUE CHECK (key_number IN (1, 2)),
    current_holder_id UUID REFERENCES auth.users(id),
    status public.key_status DEFAULT 'available'::public.key_status,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Key transfers history
CREATE TABLE public.key_transfers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key_id UUID NOT NULL REFERENCES public.keys(id) ON DELETE CASCADE,
    from_user_id UUID REFERENCES auth.users(id),
    to_user_id UUID NOT NULL REFERENCES auth.users(id),
    transfer_date TIMESTAMPTZ DEFAULT NOW(),
    confirmed BOOLEAN DEFAULT false,
    confirmed_at TIMESTAMPTZ
);

-- Email whitelist for auto-approval
CREATE TABLE public.email_whitelist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX idx_profiles_membership_status ON public.profiles(membership_status);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);
CREATE INDEX idx_board_members_user_id ON public.board_members(user_id);
CREATE INDEX idx_board_members_is_active ON public.board_members(is_active);
CREATE INDEX idx_events_start_date ON public.events(start_date);
CREATE INDEX idx_events_event_type ON public.events(event_type);
CREATE INDEX idx_event_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX idx_event_registrations_user_id ON public.event_registrations(user_id);
CREATE INDEX idx_keys_current_holder ON public.keys(current_holder_id);
CREATE INDEX idx_key_transfers_key_id ON public.key_transfers(key_id);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- Check if user is a board member
CREATE OR REPLACE FUNCTION public.is_board_member(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.board_members
        WHERE user_id = _user_id
          AND is_active = true
    )
$$;

-- Check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT public.has_role(_user_id, 'admin'::public.app_role)
$$;

-- Handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    is_whitelisted BOOLEAN;
BEGIN
    -- Check if email is whitelisted
    SELECT EXISTS (
        SELECT 1 FROM public.email_whitelist WHERE email = NEW.email
    ) INTO is_whitelisted;

    -- Create profile
    INSERT INTO public.profiles (id, email, full_name, membership_status)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        CASE WHEN is_whitelisted THEN 'active'::public.membership_status ELSE 'pending'::public.membership_status END
    );

    -- Assign default member role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'member'::public.app_role);

    RETURN NEW;
END;
$$;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_keys_updated_at
    BEFORE UPDATE ON public.keys
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =============================================
-- INITIAL DATA
-- =============================================

-- Insert the 2 venue keys
INSERT INTO public.keys (key_number, status) VALUES (1, 'available');
INSERT INTO public.keys (key_number, status) VALUES (2, 'available');

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.key_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_whitelist ENABLE ROW LEVEL SECURITY;
