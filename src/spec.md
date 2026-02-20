# Specification

## Summary
**Goal:** Fix recurring actor availability errors that cause a regression cycle where fixing one feature breaks another.

**Planned changes:**
- Investigate and resolve root cause of 'actor not available' errors
- Ensure stable actor initialization and persistence throughout application lifecycle
- Review and fix frontend actor initialization in useActor.ts to handle authentication state changes
- Verify and stabilize media asset deletion functionality to work without causing actor availability issues

**User-visible outcome:** All features work reliably without regression cycles, media assets can be deleted successfully, and the application remains stable during authentication state changes.
