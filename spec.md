# Specification

## Summary
**Goal:** Refactor the createAdminUser function to use msg.caller-based authentication with first-admin bootstrapping and super_admin authorization.

**Planned changes:**
- Remove hardcoded Principal.fromText("aaaaa-aa") from createAdminUser function
- Use msg.caller as the admin user ID instead of hardcoded principal
- Implement first-admin logic: when adminIdCounter is 0, automatically assign #super_admin role and bypass authorization checks
- Enforce that only #super_admin users can create new admins after the first admin exists
- Prevent duplicate admin registration by checking if msg.caller already has an admin account
- Display the complete final implementation of the refactored function

**User-visible outcome:** The first user to call createAdminUser becomes a super admin automatically. After that, only super admins can create new admin accounts. Each admin is uniquely identified by their Internet Identity principal, and duplicate registrations are prevented.
