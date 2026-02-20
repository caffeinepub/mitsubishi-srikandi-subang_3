# Specification

## Summary
**Goal:** Implement a fully functional realtime visitor statistics system that tracks all public page visits and displays comprehensive analytics in the admin dashboard.

**Planned changes:**
- Create backend data structures (visits and visitor_sessions tables) using Motoko stable storage with Int timestamps
- Implement trackVisitor() function to record visits and update session activity
- Implement cleanupExpiredSessions() function to mark inactive sessions offline after 5 minutes
- Implement statistics calculation functions: getTotalVisitors(), getTodayVisitors(), getYesterdayVisitors(), getWeeklyVisitors(), getMonthlyVisitors(), getYearlyVisitors(), getOnlineUsers()
- Implement page tracking functions: getTotalPageViews(), getPageViewsByUrl(), getVisitorTrendLast30Days()
- Update getVisitorStats() backend method to return comprehensive real statistics (no hardcoded values)
- Implement frontend tracking middleware that automatically executes on every public page load (excluding admin routes and bots)
- Update VisitorStatsPage to display all 8 realtime statistics with auto-refresh every 15 seconds
- Add line chart showing 30-day visitor trend and bar chart showing top 10 most visited pages
- Update useVisitorStats hook to properly call backend methods without placeholder logic
- Implement periodic cleanup job running every 5 minutes to maintain accurate online user counts

**User-visible outcome:** Admin can view a comprehensive, realtime visitor statistics dashboard showing total visitors, today/yesterday/weekly/monthly/yearly counts, current online users, total page views, 30-day visitor trends, and top 10 most visited pages. All public page visits are automatically tracked without requiring user action. Statistics auto-refresh every 15 seconds to show current data.
