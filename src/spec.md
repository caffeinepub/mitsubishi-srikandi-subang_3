# Specification

## Summary
**Goal:** Refactor the Website Settings endpoint to use the standard validateSession function instead of manual session validation.

**Planned changes:**
- Remove all manual session validation logic (header checks, token parsing, session map lookups) from the Website Settings endpoint
- Call validateSession(request) at the start of the endpoint, following the same pattern as the Media endpoint
- Use the user Principal returned from validateSession for authorization checks
- Return HTTP 401 only when validateSession fails

**User-visible outcome:** No change to user experience; the Website Settings endpoint will continue to function identically but with standardized authentication implementation.
