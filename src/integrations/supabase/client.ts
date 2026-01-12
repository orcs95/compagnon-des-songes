import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://magstjgkxeiustlhcprw.supabase.co';  // e.g., 'https://xxxxx.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_2RgbJbjuPeW1kqtaF_cjSQ_ZJNEOtki';  // Your anon/public key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
