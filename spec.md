# Mitsubishi Srikandi Subang

## Current State

Sistem menggunakan satu IC Canister dengan stable storage — secara arsitektur sudah merupakan single production database. Tidak ada `DATABASE_DRAFT`, `DATABASE_DEV`, atau multi-database lainnya. Semua collection (visitorSessions, visitorStats, dailyStats, pageViewsMap, mediaAssets, websiteSettings, dll.) tersimpan dalam stable variables di canister yang sama.

**Masalah yang ditemukan:**

1. `getTopPageViews` di backend memerlukan autentikasi admin (`#admin` permission), tapi digunakan di `VisitorStatsPage` via `useGetPageViews` yang hanya mengecek `!!actor` — gagal untuk anonymous actor dan menyebabkan stats selalu 0.

2. `useAdminStats` masih gated dengan `!!actor && !isFetching` — flag `isFetching` dari `useActor` bisa menyebabkan query tidak pernah jalan.

3. `getDailyVisitorTrend` adalah public query tapi `useGetVisitorTrend` memanggil via actor yang authenticated — jika actor gagal init, trend data tidak muncul.

4. `visitorStats` di backend adalah var biasa (bukan stable) — nilainya reset ke default setelah canister restart/upgrade. Perlu dijadikan stable.

5. `visitorSessions`, `visits`, `pageViewsMap`, `dailyStats`, `dailySessionSet` menggunakan `Map.empty` — di Motoko/Caffeine backend, Map dari `mo:core/Map` sudah persistent (stable) secara default di dalam actor stable context, tapi `var visitorStats` tidak.

## Requested Changes (Diff)

### Add
- Tidak ada tambahan collection atau endpoint baru
- Buat `getTopPageViews` menjadi public query (tidak memerlukan auth) agar bisa diakses dari frontend tanpa authenticated actor
- Buat `getDailyVisitorTrend` tetap public (sudah public, pertahankan)

### Modify
- Backend: ubah `getTopPageViews` dari admin-only menjadi public query
- Frontend `useVisitorStats.ts`: pastikan semua hooks hanya bergantung pada `!!actor` (hapus `isFetching` guard)
- Frontend `useAdminStats.ts`: hapus `!isFetching` dari enabled condition
- Frontend `PublicLayout.tsx`: pastikan tracking tidak blocked oleh kondisi apapun selain `isAdminRoute` dan `isBot`
- Semua hook stats menggunakan cache failsafe agar tidak flash ke 0

### Remove
- Guard `!isFetching` dari `useAdminStats`
- Auth requirement dari `getTopPageViews` (jadikan public query)

## Implementation Plan

1. Update `src/backend/main.mo`: ubah `getTopPageViews` menjadi `public query func` (tanpa caller auth check)
2. Update `src/frontend/src/hooks/useAdminStats.ts`: hapus `!isFetching` dari `enabled`
3. Update `src/frontend/src/hooks/useVisitorStats.ts`: pastikan semua hooks hanya gated `!!actor`, tidak ada kondisi tambahan
4. Update `src/frontend/src/backend.d.ts`: pastikan `getTopPageViews` signature tidak butuh auth (tetap sama di frontend karena actor anonymous juga bisa call public query)
5. Validate build
