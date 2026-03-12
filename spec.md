# Mitsubishi Srikandi Subang

## Current State

The `/admin/pengaturan` page exists at `src/frontend/src/pages/admin/WebsiteSettingsPage.tsx`. It has an unstructured layout with sections: Banner Images (main + CTA side by side), Informasi Situs, Informasi Kontak, Media Sosial, and Konten Tambahan (sales consultant + footer text). The `WebsiteSettings` interface in `backend.d.ts` is missing two fields: `mainBannerVideoId` and `mainBannerImageId2`.

## Requested Changes (Diff)

### Add
- `mainBannerVideoId?: bigint` to `WebsiteSettings` in `backend.d.ts`
- `mainBannerImageId2?: bigint` to `WebsiteSettings` in `backend.d.ts`
- State variables and Media Manager pickers for `mainBannerVideoId` and `mainBannerImageId2` in `WebsiteSettingsPage.tsx`

### Modify
- `WebsiteSettingsPage.tsx`: Reorganize the entire form into 5 labeled card sections in the exact order specified:
  1. MAIN BANNER (Video Banner, Image 1, Image 2)
  2. CTA BANNER
  3. SALES PROFILE (Foto Sales Consultant, Nama Sales Consultant)
  4. INFORMASI SITUS (footerAboutText, siteName, operationalHours, contactPhone, contactWhatsapp, contactEmail, dealerAddress)
  5. MEDIA SOSIAL (facebookUrl, instagramUrl, tiktokUrl, youtubeUrl)
- Save button remains at the bottom, calls `updateWebsiteSettings()` with all fields including the two new ones

### Remove
- Old unordered layout (Banner Images side-by-side grid, Informasi Kontak as separate section)

## Implementation Plan

1. Extend `backend.d.ts` WebsiteSettings with `mainBannerVideoId?: bigint` and `mainBannerImageId2?: bigint`
2. Rewrite `WebsiteSettingsPage.tsx` with 5 card sections in exact field order
3. Add state + pickers for `mainBannerVideoId` and `mainBannerImageId2`
4. Include all fields in the `updateWebsiteSettings()` call on submit
5. Validate and build
