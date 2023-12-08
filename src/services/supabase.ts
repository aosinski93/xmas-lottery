import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from './credentials';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
