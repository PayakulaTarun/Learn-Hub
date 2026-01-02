import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Environment Variables', () => {
    beforeEach(() => {
        vi.resetModules();
    });

    it('should validate correct environment variables', async () => {
        process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';

        const { env } = await import('../../src/lib/env');
        expect(env.NEXT_PUBLIC_SUPABASE_URL).toBe('https://example.supabase.co');
    });

    it('should crash on missing environment variables', async () => {
        process.env.NEXT_PUBLIC_SUPABASE_URL = ''; // Invalid url

        await expect(import('../../src/lib/env')).rejects.toThrow();
    });
});
