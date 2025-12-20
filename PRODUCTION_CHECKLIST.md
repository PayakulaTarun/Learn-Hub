# Production Deployment Checklist

## 1. Pre-Deployment (Automated Gate)
- [ ] CI Pipeline Passed (Build + Test + Validate)
- [ ] No High Vulnerabilities (`npm audit` Clean)
- [ ] Environment Variables Validated (`lib/env.ts`)

## 2. Infrastructure & Security
- [ ] RLS Policies Applied to Supabase Production
- [ ] Sentry DSN Configured in Vercel
- [ ] Database Backups Enabled
- [ ] Rate Limiting Active (`middleware.ts`)

## 3. Post-Deployment Verification (Day 0)
- [ ] Smoke Test: Login Flow
- [ ] Smoke Test: Roadmap Loading (No 404s)
- [ ] Check Sentry for new error spikes
- [ ] Verify API /api/auth/events is receiving data

## 4. Rollback Plan
IF (Error Rate > 1%) OR (Core Flow Broken):
1. Revert Vercel Deployment to previous commit.
2. Flush CDN Cache.
3. Check Database Logs for corruption.
