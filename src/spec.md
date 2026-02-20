# Specification

## Summary
**Goal:** Fix Media Manager to display actual image thumbnails instead of generic car icon placeholders.

**Planned changes:**
- Replace car icon placeholders in MediaAssetGrid with actual uploaded image thumbnails
- Implement utility function to generate blob URLs from asset IDs using canister HTTP endpoint
- Add proper image loading states and error handling with fallback UI
- Ensure thumbnails maintain aspect ratio within grid cells

**User-visible outcome:** Media Manager shows actual preview thumbnails of uploaded images, making it easier to identify and manage media assets visually.
