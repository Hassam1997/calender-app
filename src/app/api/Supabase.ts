// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Your Supabase URL and anon key
const SUPABASE_URL: any = process.env.NEXT_PUBLIC_API_KEY;
const SUPABASE_ANON_KEY: any = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
