# Specification

## Summary
**Goal:** Fix media loading for authenticated admin users by adjusting backend authorization logic.

**Planned changes:**
- Modify getMediaAssets to allow access for any authenticated user without strict principal validation
- Keep admin role validation for deleteMediaAsset unchanged
- Verify media list loads correctly in admin media manager after login
- Leave upload logic unmodified

**User-visible outcome:** Admin users can immediately view the media list after logging in without authorization errors.
