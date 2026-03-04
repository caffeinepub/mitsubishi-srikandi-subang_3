# Specification

## Summary
**Goal:** Add a temporary `forceSetMeAsSuperAdmin` function to the backend to allow the caller to set their own role to `#super_admin`.

**Planned changes:**
- Add a new public shared function `forceSetMeAsSuperAdmin` to `backend/main.mo` that updates the caller's role to `#super_admin` in `adminStore` and returns a confirmation string
- No existing logic, data structures, or other functions are modified

**User-visible outcome:** A developer can call `forceSetMeAsSuperAdmin` on the backend canister to elevate their own account to super admin role without any frontend changes.
