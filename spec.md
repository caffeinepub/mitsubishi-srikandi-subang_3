# Mitsubishi Srikandi Subang

## Current State

The app is a full-stack automotive dealership platform with:
- Motoko backend: 20+ stable collections including vehicles (passenger + commercial), promotions, blogPosts, mediaAssets, websiteSettings, adminUsers, visitorStats.
- Frontend: React + TypeScript with public website and admin panel.
- Public search currently done via a basic SearchProduk component that redirects to `/mobil-keluarga?search=...` — no real search engine backend.
- Section "Stay Connected" uses a minimal Input + Button, no autosuggestion, no grouped results.
- No `/search` route exists.
- No SearchIndex collection in backend.

## Requested Changes (Diff)

### Add
- **Backend**: New `SearchIndex` stable collection with fields: id, type (vehicle/promo/article), title, keywords, summary, url, image, category, updated_at.
- **Backend**: `searchIndex` Map and `searchIndexIdCounter` variable.
- **Backend**: `SearchIndexEntry` type definition.
- **Backend**: `searchGlobal(query: Text) : async SearchResults` — public query endpoint. Returns grouped results: vehicles (max 5), promos (max 5), articles (max 5). Supports case-insensitive, partial matching, ranking by relevance, and keyword intent detection.
- **Backend**: `getAutosuggestions(query: Text) : async [SearchIndexEntry]` — returns top matches by title for dropdown, max 5 per category (15 total).
- **Backend**: `rebuildSearchIndex() : async ()` — admin-only utility that rebuilds entire index from vehicles, promos, and blogPosts.
- **Backend**: Auto-update SearchIndex when vehicles, promos, or articles are created/updated/deleted. Since the existing backend doesn't have explicit create/update vehicle functions visible in current code (data appears managed via Vehicle/Promotion/BlogPost maps directly), add internal `updateSearchIndexForVehicle`, `updateSearchIndexForPromo`, `updateSearchIndexForArticle` helper functions called from any mutating operations.
- **Frontend**: New `SearchPage.tsx` at `/search?q=keyword` — displays grouped results (Kendaraan, Promo, Artikel) with pagination, using `searchGlobal` backend API.
- **Frontend**: Redesigned `SearchProduk.tsx` — larger, prominent search bar, minimal/clean design, autosuggestion dropdown while typing (using `getAutosuggestions`), grouped by category in dropdown, max 5 per group; pressing Enter or "lihat semua" navigates to `/search?q=...`.
- **Frontend**: Route `/search` added to App.tsx with SearchPage.

### Modify
- **Backend**: Add `SearchIndexEntry` type and `searchIndex` map alongside existing collections.
- **Backend**: Add search result types: `SearchResults { vehicles: [SearchIndexEntry]; promos: [SearchIndexEntry]; articles: [SearchIndexEntry] }`.
- **Frontend**: `SearchProduk.tsx` — full redesign with autosuggestion, grouped dropdown, intent-aware navigation.
- **Frontend**: `App.tsx` — add `/search` route.

### Remove
- Nothing removed from existing collections or endpoints.

## Implementation Plan

### Backend
1. Add `SearchIndexEntry` type with fields: id (Nat), entryType (Text: "vehicle"/"promo"/"article"), title (Text), keywords (Text), summary (Text), url (Text), image (Text), category (Text), updatedAt (Int).
2. Add `SearchResults` type: `{ vehicles: [SearchIndexEntry]; promos: [SearchIndexEntry]; articles: [SearchIndexEntry] }`.
3. Add `searchIndex : Map<Nat, SearchIndexEntry>` and `searchIndexIdCounter : Nat = 1`.
4. Add internal helpers: `upsertSearchIndexEntry`, `buildKeywordsFromVehicle`, `buildKeywordsFromPromo`, `buildKeywordsFromArticle`.
5. Add `rebuildSearchIndex()` — admin-only, clears and rebuilds index from all vehicles, promotions, blogPosts.
6. Add `searchGlobal(query: Text)` — public query, case-insensitive partial match, relevance ranking (exact title > keyword > category > summary), intent detection (promo keywords boost promos, article keywords boost articles), returns SearchResults with max 5 per group.
7. Add `getAutosuggestions(query: Text)` — public query, returns max 15 results (5 per type), title-based matching.

### Frontend
1. Update `backend.d.ts` with new types and endpoints (SearchIndexEntry, SearchResults, searchGlobal, getAutosuggestions, rebuildSearchIndex).
2. Redesign `SearchProduk.tsx`:
   - Large centered search bar with subtle shadow, rounded design.
   - Autosuggestion dropdown: grouped by Kendaraan / Promo / Artikel, max 5 each, shows on typing (debounced 300ms).
   - On Enter or click "Cari": navigate to `/search?q=keyword`.
   - On click suggestion item: navigate to item's URL.
   - "Lihat semua hasil" link at bottom of dropdown navigates to `/search?q=keyword`.
3. Create `SearchPage.tsx`:
   - Reads `?q=` from URL query params.
   - Calls `searchGlobal(query)` backend endpoint.
   - Displays results grouped: Kendaraan, Promo, Artikel with section headers.
   - Each result: image thumbnail, title, category badge, summary snippet, link to URL.
   - Pagination (client-side, 10 items per page per group or full list).
   - Empty state if no results found.
4. Add `/search` route to `App.tsx` wrapped in `PublicLayout`.
5. Add proper `data-ocid` markers on all interactive search elements.
