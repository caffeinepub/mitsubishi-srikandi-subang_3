# Specification

## Summary
**Goal:** Build the foundational backend infrastructure for the Mitsubishi Srikandi Subang dealer platform using Internet Computer canister architecture with stable storage, persistent blob storage for media assets, and a comprehensive vehicle data management system.

**Planned changes:**
- Implement stable canister storage architecture with persistent blob storage that survives refresh, rebuild, redeploy, and upgrade operations
- Create deterministic blob storage binding with public HTTPS gateway resolver using URL pattern /media/{collection}/{assetId}/{fileName} with file hash fingerprinting
- Establish stable canister database with 16 auto-persistent collections: passengerVehicles, commercialVehicles, promotions, testimonials, blogPosts, contacts, creditSimulations, visitorStats, mediaAssets, adminUsers, websiteSettings, productLikes, productShares, articleLikes, articleShares, articleComments
- Implement visitorStats collection with comprehensive tracking fields (totalVisitors, dailyVisitors, yesterdayVisitors, weeklyVisitors, monthlyVisitors, yearlyVisitors, onlineVisitors, pageViews, lastUpdated)
- Create websiteSettings collection with site configuration and media asset references
- Build passenger vehicle relational data layer with 7 collections supporting variants, colors, variant-color mapping, images with angle/background type, specifications, and features
- Build commercial vehicle relational data layer with 7 collections supporting categories, variants without color system, variant mapping, variant images, specifications, and features
- Implement nested CMS data hierarchy with cascade delete and relational integrity for both passenger and commercial vehicles
- Establish stable memory mapping binding for collections, variant mapping, media binding, and counters
- Create admin authentication foundation with seeded super admin account (email: blankster2024@gmail.com, password: dewi4more) including password hashing, session persistence, and role schema
- Implement canister lifecycle hooks (pre_upgrade/post_upgrade) with snapshot and restore functionality using stable binary mapping serialization
- Build media library backend manager with blob-only operations (upload, replace, delete, index binding)
- Implement deployment safety lock preventing modification of storage binding, DB mapping, vehicle relations, media index, and auth system

**User-visible outcome:** A fully functional backend canister infrastructure with persistent storage, comprehensive vehicle data management system, visitor analytics, website settings, and admin authentication ready for CMS integration. All data and media assets persist across canister upgrades and redeployments.
