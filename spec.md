# Mitsubishi Srikandi Subang

## Current State
The visitor analytics system exists but shows all zeros because:
1. `getVisitorStats()` requires `#admin` permission — public visitors (Footer) cannot call it
2. `visitorsThisYear` is never calculated in `recalculateStats()` — always stays 0
3. No `getDailyVisitorTrend()` or `getTopPageViews()` backend functions exist — trend chart and top pages never load
4. `useGetVisitorTrend()` and `useGetPageViews()` hooks have `enabled: false` — they never fire
5. No PageViews map in backend — per-URL tracking unavailable
6. No session-expiry logic in frontend — 30-minute inactivity reset not implemented
7. No double-count prevention — a session can be counted multiple times per day
8. `trackVisitor()` is called from PublicLayout but requires an authenticated actor — anonymous public visitors may not trigger it

## Requested Changes (Diff)

### Add
- Backend: `public query func getPublicVisitorStats()` — no auth required, returns same `VisitorStats`
- Backend: `public query func getDailyVisitorTrend()` — returns `[(Int, Nat)]` for last 30 days keyed by day timestamp, no auth required
- Backend: `let pageViewsMap = Map.empty<Text, Nat>()` — per-URL page view counter
- Backend: `public query func getTopPageViews()` — returns `[(Text, Nat)]` top 10 pages sorted by view count, no auth required
- Backend: `visitorsThisYear` calculation in `recalculateStats()` (365 days window)
- Backend: session visited-today deduplication — track `sessionId+date` key in a Set to prevent double-counting daily visitors
- Backend: `pageViewsMap` updated on every `trackVisitor()` call using `pageUrl` as key
- Frontend: `useGetVisitorTrend()` — enabled, calls `getDailyVisitorTrend()` with 30s refetch
- Frontend: `useGetPageViews()` — enabled, calls `getTopPageViews()` with 30s refetch
- Frontend: `useGetVisitorStats()` — calls `getPublicVisitorStats()` (no auth needed), 30s refetch
- Frontend: session expiry logic in `visitorTracking.ts` — check `visitor_last_active` in localStorage, regenerate sessionId if > 30 min
- Frontend: `trackVisit(pagePath)` utility that wraps `actor.trackVisitor()` call

### Modify
- Backend: `recalculateStats()` — add `visitorsThisYear` using 365-day window
- Backend: `trackVisitor()` — also update `pageViewsMap[pageUrl]`, add deduplication for daily visitor counting
- Frontend: `useGetVisitorStats` hook — switch from auth-required `getVisitorStats` to public `getPublicVisitorStats`; add 30s refetch
- Frontend: `PublicLayout` — use updated `trackVisit()` with session expiry check
- Frontend: `VisitorStatsPage` — auto-refresh every 30s, wire trend chart and top pages to real data
- Frontend: `Footer` — already uses `useGetVisitorStats` but needs to work without auth (covered by public endpoint)

### Remove
- Nothing removed — all existing APIs preserved

## Implementation Plan
1. Modify `main.mo`:
   - Add `let pageViewsMap = Map.empty<Text, Nat>()` stable map for per-URL counts
   - Add `let dailySessionSet = Map.empty<Text, Bool>()` for dedup keys (`sessionId + "-" + dayKey`)
   - Fix `recalculateStats()` to include `visitorsThisYear` (365-day window)
   - Update `trackVisitor()` to: increment `pageViewsMap[pageUrl]`, check dedup key before counting new visitor
   - Add `public query func getPublicVisitorStats()` — no permission check
   - Add `public query func getDailyVisitorTrend()` — iterate `dailyStats`, return last 30 days as `[(Int, Nat)]`
   - Add `public query func getTopPageViews()` — iterate `pageViewsMap`, sort DESC, return top 10 as `[(Text, Nat)]`

2. Regenerate `backend.d.ts` with new functions

3. Fix `visitorTracking.ts`:
   - Add session-expiry: check `visitor_last_active`, if > 30 min since last activity, clear sessionId to force new session
   - Update `lastActive` on every call

4. Fix `useVisitorStats.ts` hooks:
   - `useGetVisitorStats` → call `getPublicVisitorStats()` (no actor auth needed, use anonymous actor or public endpoint)
   - `useGetVisitorTrend` → enable, call `getDailyVisitorTrend()`, 30s refetch
   - `useGetPageViews` → enable, call `getTopPageViews()`, 30s refetch

5. Fix `PublicLayout.tsx`:
   - Call session-expiry check before tracking
   - Pass `pagePath` (pathname) to tracking call

6. Fix `VisitorStatsPage.tsx`:
   - Change refetch interval to 30s
   - Ensure chart and top pages render with real data

7. Validate frontend build
