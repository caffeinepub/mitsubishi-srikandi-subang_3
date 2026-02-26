# Specification

## Summary
**Goal:** Fix the super_admin bootstrap and recovery logic in the backend so that the system always guarantees at least one super_admin exists.

**Planned changes:**
- Update bootstrap logic so that when the Admin table is empty and a Principal logs in for the first time, that Principal is assigned role `super_admin` instead of `admin`
- Add inline recovery logic inside existing authenticated update calls that require admin privileges: if `super_admin_count == 0`, automatically promote the calling Principal's role to `super_admin` (no separate public recovery function)
- Update `backend/migration.mo` so that if no record carries role `super_admin` after migration, the first migrated record is promoted to `super_admin`

**User-visible outcome:** The system will always have at least one super_admin, preventing lockout scenarios. The first Principal to log in on a fresh deployment is automatically super_admin, and if all super_admins are ever removed, the next privileged action automatically recovers super_admin access for the caller.
