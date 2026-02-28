# Specification

## Summary
**Goal:** Add a `whoAmI` backend function that returns the caller's principal, and a temporary frontend test button to invoke it.

**Planned changes:**
- Add `whoAmI` public shared function to `backend/main.mo` that returns the caller's principal as Text using the `shared({ caller })` pattern
- Add a "Test whoAmI" button in a visible frontend location (e.g., admin dashboard or login page) that calls `actor.whoAmI()` and displays the result via `alert()` or `console.log()`

**User-visible outcome:** A "Test whoAmI" button appears in the frontend UI; clicking it shows the caller's principal string as an alert or console log output.
