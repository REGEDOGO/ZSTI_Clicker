import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://efngorxpicqplqdgtpxm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_w7acJWzMgNxgFT9HGG59Lw_hkEZ38Ol';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
