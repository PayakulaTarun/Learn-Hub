import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// Hardcoded secrets have been REMOVED.
// This client initialization relies strictly on validated environment variables.
export const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
