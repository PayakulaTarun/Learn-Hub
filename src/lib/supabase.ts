import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://iwpyfdodnvneylgdmuyk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3cHlmZG9kbnZuZXlsZ2RtdXlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMTc0NDEsImV4cCI6MjA4MTY5MzQ0MX0.PCGpTF8kaUX7RJx2QDcLBpFHGRtLy9CRUKRjCakwPdI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
