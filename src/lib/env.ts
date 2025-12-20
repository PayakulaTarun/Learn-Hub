import { z } from 'zod';

const envSchema = z.object({
    NEXT_PUBLIC_SUPABASE_URL: z.string().url({ message: "Invalid Supabase URL" }),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, { message: "Missing Supabase Anon Key" }),
});

// Validate environment variables at runtime
// This will throw a clear error if variables are missing or invalid
const processEnv = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

const parsed = envSchema.safeParse(processEnv);

if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    // In development, we might want to warn. In production, we MUST fail.
    // For now, we throw to prevent insecure startup.
    throw new Error('Invalid environment variables. Check your .env file.');
}

export const env = parsed.data;
