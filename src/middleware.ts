import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // General API Limit
const MAX_AI_REQUESTS = 10; // Stricter AI Limit

const ipMap = new Map<string, { count: number; aiCount: number; expires: number }>();

export function middleware(request: NextRequest) {
    if (!request.nextUrl.pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    const ip = request.ip || 'anonymous';
    const now = Date.now();
    const isAiRoute = request.nextUrl.pathname.startsWith('/api/ai');

    if (ipMap.has(ip) && ipMap.get(ip)!.expires < now) {
        ipMap.delete(ip);
    }

    const record = ipMap.get(ip) || { count: 0, aiCount: 0, expires: now + RATE_LIMIT_WINDOW };

    // Check General Limit
    if (record.count >= MAX_REQUESTS) {
        return new NextResponse(JSON.stringify({ error: 'Too many requests' }), { status: 429 });
    }

    // Check AI Limit
    if (isAiRoute && record.aiCount >= MAX_AI_REQUESTS) {
        return new NextResponse(JSON.stringify({ error: 'AI Rate limit exceeded. Try again later.' }), { status: 429 });
    }

    record.count++;
    if (isAiRoute) record.aiCount++;

    ipMap.set(ip, record);

    return NextResponse.next();
}

export const config = {
    matcher: '/api/:path*',
};
