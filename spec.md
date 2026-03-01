# Specification

## Summary
**Goal:** Fix the `useActor` hook to create the backend actor using the authenticated Internet Identity instead of an anonymous identity.

**Planned changes:**
- Update `frontend/src/hooks/useActor.ts` to read the `authClient` instance from the `InternetIdentity` context
- Create the backend actor using `authClient.getIdentity()` instead of an anonymous identity
- Re-create the actor whenever authentication state changes (login/logout)
- Fall back gracefully to an anonymous actor when the user is unauthenticated

**User-visible outcome:** Canister calls made after logging in with Internet Identity will carry the user's authenticated principal instead of an anonymous identity, enabling proper authenticated interactions with the backend.
