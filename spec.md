# Specification

## Summary
**Goal:** Fix authentication token not being attached to CRUD requests by storing the token in localStorage and using a global HTTP interceptor to send it with every protected request.

**Planned changes:**
- Store the authentication token in `localStorage` after successful login instead of keeping it only in memory
- Create a centralized API client utility (e.g., `apiClient.ts`) that reads the token from `localStorage` and attaches the `Authorization: Bearer <token>` header to all POST, PUT, and DELETE requests
- Update all data hooks (`useAdminUsers`, `useVehicles`, `usePromotions`, `useTestimonials`, `useBlogPosts`, `useMediaAssets`, `useCreditSimulations`, `useContacts`, `useWebsiteSettings`) to use this shared API client
- On logout or token expiry, clear the token from `localStorage` and redirect the user to the login page

**User-visible outcome:** Authenticated users can perform save/update/delete actions without encountering "Session expired" or 401 Unauthorized errors, and their session persists across page refreshes.
