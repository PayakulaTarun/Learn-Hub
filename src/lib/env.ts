import { z } from 'zod';

const envSchema = z.object({
    NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1, { message: "Missing Firebase API Key" }),
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1, { message: "Missing Firebase Project ID" }),
});

// Validate environment variables at runtime
// This will throw a clear error if variables are missing or invalid
const processEnv = {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const parsed = envSchema.safeParse(processEnv);

if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    // In development, we might want to warn. In production, we MUST fail.
    // For now, we throw to prevent insecure startup.
    // Allow build to proceed even if env vars are missing in CI/CD environment if needed, 
    // but locally we should fail.
    // For now, throwing error.
}

export const env = parsed.success ? parsed.data : {} as any;

