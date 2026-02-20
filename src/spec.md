# Specification

## Summary
**Goal:** Add debug logging to the deleteMediaAsset function to troubleshoot admin authorization issues.

**Planned changes:**
- Add logging for caller principal at function entry
- Add logging for user data retrieved from storage
- Add logging for detected role value
- Include detected role in authorization error messages

**User-visible outcome:** When deleteMediaAsset fails due to authorization, the error message will show the detected role, helping administrators diagnose permission issues.
