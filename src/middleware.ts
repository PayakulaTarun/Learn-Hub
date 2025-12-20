import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // 100 requests per minute per IP

// Simple in-memory store (Note: For multi-instance deploy, use Redis/Upstash)
const ipMap = new Map<string, { count: number; expires: number }>();

export function middleware(request: NextRequest) {
    // Only protect API routes
    if (!request.nextUrl.pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    const ip = request.ip || 'anonymous';
    const now = Date.now();

    // Clean up
    if (ipMap.has(ip) && ipMap.get(ip)!.expires < now) {
        ipMap.delete(ip);
    }

    const record = ipMap.get(ip) || { count: 0, expires: now + RATE_LIMIT_WINDOW };

    if (record.count >= MAX_REQUESTS) {
        return new NextResponse(
            JSON.stringify({ error: 'Too many requests' }),
            { status: 429, headers: { 'content-type': 'application/json' } }
        );
    }

    record.count++;
    ipMap.set(ip, record);

    return NextResponse.next();
}

export const config = {
    matcher: '/api/:path*',
};
