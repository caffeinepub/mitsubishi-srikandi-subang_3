# Specification

## Summary
**Goal:** Rebuild the admin authorization system to use persistent role storage instead of hardcoded principal comparisons.

**Planned changes:**
- Implement persistent storage for admin users in the backend using stable variables that survive canister upgrades
- Store admin principal and role mapping in backend stable storage
- Modify deleteMediaAsset function to verify admin role from stored user data instead of hardcoded principal comparison
- Ensure currently logged-in admin user has role 'admin' assigned in persistent storage
- Verify admin role at runtime before allowing delete operations
- Preserve existing media listing and upload functionality unchanged

**User-visible outcome:** Admin users can delete media assets with proper role-based authorization that persists across deployments, while media listing and upload operations continue to work as before.
