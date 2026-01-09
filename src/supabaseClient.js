import { createClient } from '@supabase/supabase-js';

// Ganti nilai di bawah dengan maklumat dari Project Settings > API di Supabase
const supabaseUrl = 'https://knwgotcdbfxgdmumblqq.supabase.co';
const supabaseAnonKey = 'sb_publishable_4iuEBYfCniJqZXiOPWb3qA_Jy1SMyeS';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);