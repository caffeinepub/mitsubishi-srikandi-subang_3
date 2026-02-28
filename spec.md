# Specification

## Summary
**Goal:** Add a principal bypass check at the very top of the `updateAdminRole` function in `backend/main.mo` so that a specific caller principal can proceed without the super admin role check.

**Planned changes:**
- In `backend/main.mo`, inside `updateAdminRole`, add a bypass check as the first statement: if the caller is `qm56h-bpinv-zejzt-qtty4-j2dph-j5h6y-fwxfs-jlsv3-suwa5-poxol-wae`, allow the call to proceed immediately; otherwise, the existing super admin guard remains unchanged.

**User-visible outcome:** The specified principal can successfully call `updateAdminRole` without being blocked by the "Unauthorized super admin only can update admin roles" error, while all other authorization behavior remains the same.
