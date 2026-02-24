import Time "mo:core/Time";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Blob "mo:core/Blob";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type DailyStats = {
    date : Int;
    visitors : Nat;
    pageViews : Nat;
  };

  public type VisitorSession = {
    sessionId : Text;
    ipAddress : Text;
    firstVisit : Int;
    lastActivity : Int;
    isOnline : Bool;
  };

  public type Visit = {
    id : Text;
    sessionId : Text;
    ipAddress : Text;
    userAgent : Text;
    pageUrl : Text;
    referrer : Text;
    deviceType : Text;
    browser : Text;
    visitedAt : Int;
  };

  public type Variant = {
    id : Nat;
    vehicleId : Nat;
    name : Text;
    displayOrder : Nat;
    overridePrice : ?Nat;
  };

  public type Color = {
    id : Nat;
    vehicleId : Nat;
    name : Text;
    colorCode : ?Text;
    active : Bool;
  };

  public type VariantColorMapping = {
    id : Nat;
    vehicleId : Nat;
    variantId : Nat;
    colorId : Nat;
    available : Bool;
  };

  public type ArticleComment = {
    id : Nat;
    userId : Principal;
    articleId : Nat;
    content : Text;
    timestamp : Int;
  };

  public type VehicleImage = {
    id : Nat;
    vehicleId : Nat;
    variantId : ?Nat;
    colorId : ?Nat;
    imageId : Text;
    default : Bool;
  };

  public type Specification = {
    id : Nat;
    vehicleId : Nat;
    name : Text;
    value : Text;
  };

  public type Feature = {
    id : Nat;
    vehicleId : Nat;
    name : Text;
    description : Text;
  };

  public type CreditSimulation = {
    id : Nat;
    userId : Principal;
    vehicleId : Nat;
    amount : Nat;
    term : Nat;
    timestamp : Int;
  };

  public type ProductLike = {
    id : Nat;
    userId : Principal;
    vehicleId : Nat;
    timestamp : Int;
  };

  public type ProductShare = {
    id : Nat;
    userId : Principal;
    vehicleId : Nat;
    timestamp : Int;
  };

  public type ContactSubmission = {
    id : Nat;
    userId : ?Principal;
    name : Text;
    email : Text;
    message : Text;
    timestamp : Int;
  };

  public type Vehicle = {
    id : Nat;
    vehicleName : Text;
    description : Text;
    basePrice : Nat;
    publishStatus : Bool;
  };

  public type VehicleCatalog = {
    vehicle : Vehicle;
    variants : [Variant];
    colors : [Color];
    variantColorMappings : [VariantColorMapping];
    images : [VehicleImage];
    specifications : [Specification];
    features : [Feature];
  };

  public type Promotion = {
    id : Nat;
    title : Text;
    description : Text;
    imageId : ?Text;
    startDate : Int;
    endDate : Int;
    active : Bool;
  };

  public type Testimonial = {
    id : Nat;
    customerName : Text;
    content : Text;
    rating : Nat;
    vehicleId : ?Nat;
    imageId : ?Text;
    approved : Bool;
    timestamp : Int;
  };

  public type BlogPost = {
    id : Nat;
    title : Text;
    content : Text;
    excerpt : Text;
    authorId : Principal;
    imageId : ?Text;
    published : Bool;
    publishedAt : ?Int;
    createdAt : Int;
    updatedAt : Int;
  };

  public type MediaAsset = {
    id : Nat;
    filename : Text;
    mimeType : Text;
    size : Nat;
    uploadedBy : Principal;
    uploadedAt : Int;
    data : Blob;
  };

  public type CommercialVehicleCategory = {
    id : Nat;
    name : Text;
    description : Text;
    imageId : ?Text;
    displayOrder : Nat;
  };

  public type AdminUser = {
    principal : Principal;
    name : Text;
    email : Text;
    role : AccessControl.UserRole;
    createdAt : Int;
  };

  public type BannerImageType = {
    #mainBanner;
    #ctaBanner;
  };

  public type BannerImage = {
    id : Nat;
    filename : Text;
    bannerType : BannerImageType;
    mimeType : Text;
    size : Nat;
    uploadedBy : Principal;
    uploadedAt : Int;
    data : Blob;
  };

  public type WebsiteSettings = {
    siteName : Text;
    contactPhone : Text;
    contactWhatsapp : Text;
    contactEmail : Text;
    dealerAddress : Text;
    operationalHours : Text;
    facebookUrl : Text;
    instagramUrl : Text;
    tiktokUrl : Text;
    youtubeUrl : Text;
    mainBannerImageId : ?Nat;
    ctaBannerImageId : ?Nat;
    lastUpdated : Int;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  public type VisitorStats = {
    totalVisitors : Nat;
    visitorsToday : Nat;
    visitorsYesterday : Nat;
    visitorsThisWeek : Nat;
    visitorsThisMonth : Nat;
    visitorsThisYear : Nat;
    onlineNow : Nat;
    pageViewsToday : Nat;
  };

  stable let variants = Map.empty<Nat, Variant>();
  stable let colors = Map.empty<Nat, Color>();
  stable let variantColorMappings = Map.empty<Nat, VariantColorMapping>();
  stable let vehicleImages = Map.empty<Nat, VehicleImage>();
  stable let specifications = Map.empty<Nat, Specification>();
  stable let features = Map.empty<Nat, Feature>();
  stable let promotions = Map.empty<Nat, Promotion>();
  stable let testimonials = Map.empty<Nat, Testimonial>();
  stable let blogPosts = Map.empty<Nat, BlogPost>();
  stable let mediaAssets = Map.empty<Nat, MediaAsset>();
  stable let commercialVehicleCategories = Map.empty<Nat, CommercialVehicleCategory>();
  stable let adminUsers = Map.empty<Principal, AdminUser>();
  stable let vehicles = Map.empty<Nat, Vehicle>();
  stable let creditSimulations = Map.empty<Nat, CreditSimulation>();
  stable let bannerImages = Map.empty<Nat, BannerImage>();
  stable let userProfiles = Map.empty<Principal, UserProfile>();
  stable var websiteSettings : WebsiteSettings = {
    siteName = "";
    contactPhone = "";
    contactWhatsapp = "";
    contactEmail = "";
    dealerAddress = "";
    operationalHours = "";
    facebookUrl = "";
    instagramUrl = "";
    tiktokUrl = "";
    youtubeUrl = "";
    mainBannerImageId = null;
    ctaBannerImageId = null;
    lastUpdated = -1;
  };

  stable let productLikes = Map.empty<Nat, ProductLike>();
  stable let productShares = Map.empty<Nat, ProductShare>();
  stable let articleComments = Map.empty<Nat, ArticleComment>();
  stable let contactSubmissions = Map.empty<Nat, ContactSubmission>();

  stable let visitorSessions = Map.empty<Text, VisitorSession>();
  stable let visits = Map.empty<Text, Visit>();

  stable var variantIdCounter = 1;
  stable var colorIdCounter = 1;
  stable var mappingIdCounter = 1;
  stable var imageIdCounter = 1;
  stable var specIdCounter = 1;
  stable var featureIdCounter = 1;
  stable var promotionIdCounter = 1;
  stable var testimonialIdCounter = 1;
  stable var blogPostIdCounter = 1;
  stable var mediaAssetIdCounter = 1;
  stable var commercialCategoryIdCounter = 1;
  stable var vehicleIdCounter = 1;
  stable var creditSimCounter = 1;
  stable var bannerImageIdCounter = 1;
  stable var likeCounter = 1;
  stable var shareCounter = 1;
  stable var commentCounter = 1;
  stable var contactCounter = 1;
  stable var visitIdCounter = 1;

  stable var visitorStats : VisitorStats = {
    totalVisitors = 0;
    visitorsToday = 0;
    visitorsYesterday = 0;
    visitorsThisWeek = 0;
    visitorsThisMonth = 0;
    visitorsThisYear = 0;
    onlineNow = 0;
    pageViewsToday = 0;
  };

  stable let dailyStats = Map.empty<Int, DailyStats>();

  func isToday(timestamp : Int, now : Int) : Bool {
    let nowNanos = now;
    let dayNanos = 24 * 60 * 60 * 1_000_000_000;
    (timestamp >= (nowNanos - dayNanos) and timestamp <= nowNanos);
  };

  func isYesterday(timestamp : Int, now : Int) : Bool {
    let nowNanos = now;
    let dayNanos = 24 * 60 * 60 * 1_000_000_000;
    let yesterdayStart = nowNanos - (2 * dayNanos);
    (timestamp >= yesterdayStart and timestamp < (yesterdayStart + dayNanos));
  };

  func isThisWeek(timestamp : Int, now : Int) : Bool {
    let nowNanos = now;
    let weekNanos = 7 * 24 * 60 * 60 * 1_000_000_000;
    (timestamp >= (nowNanos - weekNanos));
  };

  func isThisMonth(timestamp : Int, now : Int) : Bool {
    let nowNanos = now;
    let monthNanos = 30 * 24 * 60 * 60 * 1_000_000_000;
    (timestamp >= (nowNanos - monthNanos));
  };

  func cleanupExpiredSessionsInternal() {
    let currentTime = Time.now();
    let timeout = 5 * 60 * 1_000_000_000;

    for ((sessionId, session) in visitorSessions.entries()) {
      if (currentTime - session.lastActivity > timeout and session.isOnline) {
        let updatedSession = { session with isOnline = false };
        visitorSessions.add(sessionId, updatedSession);
      };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared func trackVisitor(
    sessionId : Text,
    ipAddress : Text,
    userAgent : Text,
    pageUrl : Text,
    referrer : Text,
    deviceType : Text,
    browser : Text,
  ) : async () {
    let currentTime = Time.now();

    let visit : Visit = {
      id = visitIdCounter.toText();
      sessionId;
      ipAddress;
      userAgent;
      pageUrl;
      referrer;
      deviceType;
      browser;
      visitedAt = currentTime;
    };
    visits.add(visit.id, visit);
    visitIdCounter += 1;

    let updatedSession = switch (visitorSessions.get(sessionId)) {
      case (?existingSession) {
        {
          existingSession with
          lastActivity = currentTime;
          isOnline = true;
        };
      };
      case (null) {
        {
          sessionId;
          ipAddress;
          firstVisit = currentTime;
          lastActivity = currentTime;
          isOnline = true;
        };
      };
    };
    visitorSessions.add(sessionId, updatedSession);

    cleanupExpiredSessionsInternal();
    updateDailyStats(currentTime);

    visitorStats := await recalculateStats();
  };

  func updateDailyStats(timestamp : Int) {
    let day = Int.abs((timestamp / (24 * 60 * 60 * 1_000_000_000)) * (24 * 60 * 60 * 1_000_000_000));
    switch (dailyStats.get(day)) {
      case (?existingStats) {
        let updatedStats = {
          existingStats with
          visitors = existingStats.visitors + 1;
          pageViews = existingStats.pageViews + 1;
        };
        dailyStats.add(day, updatedStats);
      };
      case (null) {
        let newStats = {
          date = day;
          visitors = 1;
          pageViews = 1;
        };
        dailyStats.add(day, newStats);
      };
    };
  };

  public shared ({ caller }) func cleanupExpiredSessions() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can cleanup expired sessions");
    };
    cleanupExpiredSessionsInternal();
  };

  func recalculateStats() : async VisitorStats {
    let currentTime = Time.now();

    let todayVisitors = visitorSessions.values().toArray().filter(
      func(session) { isToday(session.firstVisit, currentTime) }
    ).size();

    let yesterdayVisitors = visitorSessions.values().toArray().filter(
      func(session) { isYesterday(session.firstVisit, currentTime) }
    ).size();

    let thisWeekVisitors = visitorSessions.values().toArray().filter(
      func(session) { isThisWeek(session.firstVisit, currentTime) }
    ).size();

    let thisMonthVisitors = visitorSessions.values().toArray().filter(
      func(session) { isThisMonth(session.firstVisit, currentTime) }
    ).size();

    let pageViewsToday = visits.values().toArray().filter(
      func(visit) { isToday(visit.visitedAt, currentTime) }
    ).size();

    {
      visitorStats with
      visitorsToday = todayVisitors;
      visitorsYesterday = yesterdayVisitors;
      visitorsThisWeek = thisWeekVisitors;
      visitorsThisMonth = thisMonthVisitors;
      pageViewsToday;
    };
  };

  public query ({ caller }) func getTotalVisitors() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view visitor statistics");
    };
    visitorSessions.size();
  };

  public query ({ caller }) func getOnlineUsers() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view visitor statistics");
    };

    let currentTime = Time.now();
    let timeout = 5 * 60 * 1_000_000_000;

    visitorSessions.values().toArray().filter(func(session) {
      currentTime - session.lastActivity <= timeout and session.isOnline
    }).size();
  };

  public query ({ caller }) func getTotalPageViews() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view visitor statistics");
    };

    visits.size();
  };

  public query ({ caller }) func getVisitorStats() : async VisitorStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view visitor statistics");
    };
    visitorStats;
  };

  public shared ({ caller }) func periodicCleanup() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can trigger periodic cleanup");
    };
    cleanupExpiredSessionsInternal();
  };

  public query ({ caller }) func getAllVisitorSessions() : async [VisitorSession] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all visitor sessions");
    };
    visitorSessions.values().toArray();
  };

  public query ({ caller }) func getAllVisits() : async [Visit] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all visits");
    };
    visits.values().toArray();
  };

  public query ({ caller }) func getStableVisitorStats() : async VisitorStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view visitor statistics");
    };
    visitorStats;
  };

  public shared ({ caller }) func uploadMediaAsset(
    filename : Text,
    mimeType : Text,
    data : Blob,
    fileSize : Nat,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can upload media assets");
    };

    let uploadedAt = Time.now();
    let mediaAsset : MediaAsset = {
      id = mediaAssetIdCounter;
      filename;
      mimeType;
      size = fileSize;
      data;
      uploadedBy = caller;
      uploadedAt;
    };

    mediaAssets.add(mediaAssetIdCounter, mediaAsset);
    mediaAssetIdCounter += 1;
  };

  public shared ({ caller }) func uploadBannerImage(
    filename : Text,
    bannerType : BannerImageType,
    mimeType : Text,
    data : Blob,
    fileSize : Nat,
  ) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can upload banner images");
    };

    let uploadedAt = Time.now();
    let bannerImage : BannerImage = {
      id = bannerImageIdCounter;
      filename;
      bannerType;
      mimeType;
      size = fileSize;
      data;
      uploadedBy = caller;
      uploadedAt;
    };

    bannerImages.add(bannerImageIdCounter, bannerImage);
    let returnId = bannerImageIdCounter;
    bannerImageIdCounter += 1;
    returnId;
  };

  public query ({ caller }) func getAllMediaAssets() : async [MediaAsset] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view media assets");
    };
    mediaAssets.values().toArray();
  };

  public query ({ caller }) func getMediaAssetById(id : Nat) : async ?MediaAsset {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view media assets");
    };
    mediaAssets.get(id);
  };

  public query ({ caller }) func getMediaAssetByBlobId(blobId : Text) : async ?MediaAsset {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view media assets");
    };

    let assets = mediaAssets.values().toArray();
    switch (assets.find(func(asset) { asset.id.toText() == blobId })) {
      case (?asset) { ?asset };
      case (null) { null };
    };
  };

  public shared ({ caller }) func updateMediaAsset(
    id : Nat,
    newFilename : Text,
    newMimeType : Text,
    newData : Blob,
    newSize : Nat,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update media assets");
    };

    switch (mediaAssets.get(id)) {
      case (?existingAsset) {
        let updatedAsset = {
          existingAsset with
          filename = newFilename;
          mimeType = newMimeType;
          data = newData;
          size = newSize;
        };
        mediaAssets.add(id, updatedAsset);
      };
      case (null) {
        Runtime.trap("Media asset not found. Cannot update non-existent asset.");
      };
    };
  };

  public shared ({ caller }) func deleteMediaAsset(id : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can delete media assets");
    };

    let asset = switch (mediaAssets.get(id)) {
      case (null) {
        Runtime.trap("Asset not found. Cannot delete non-existent asset.");
      };
      case (?asset) { asset };
    };

    if (caller == asset.uploadedBy or AccessControl.isAdmin(accessControlState, caller)) {
      mediaAssets.remove(id);
      true;
    } else {
      Runtime.trap("Unauthorized: Only the uploader or an admin can delete this asset.");
    };
  };

  public query ({ caller }) func getAssetsByUploader(uploader : Principal) : async [MediaAsset] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view assets by uploader");
    };
    mediaAssets.values().toArray().filter(
      func(asset) { asset.uploadedBy == uploader }
    );
  };

  public query ({ caller }) func getAssetsByDateRange(startDate : Int, endDate : Int) : async [MediaAsset] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view assets by date range");
    };
    mediaAssets.values().toArray().filter(
      func(asset) { asset.uploadedAt >= startDate and asset.uploadedAt <= endDate }
    );
  };

  public query ({ caller }) func getMediaAssets() : async [MediaAsset] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view media assets");
    };
    mediaAssets.values().toArray();
  };

  public query func getBannerImages() : async [BannerImage] {
    bannerImages.values().toArray();
  };

  public shared ({ caller }) func updateWebsiteSettings(newSettings : WebsiteSettings) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update website settings");
    };

    websiteSettings := { newSettings with lastUpdated = Time.now() };
  };

  public query func getWebsiteSettings() : async WebsiteSettings {
    websiteSettings;
  };

  // Completed and refactored createAdminUser function
  public shared ({ caller }) func createAdminUser(
    name : Text,
    email : Text,
    role : AccessControl.UserRole,
  ) : async AdminUser {
    // First admin logic: create with admin role and bypass authorization if no existing admins
    if (adminUsers.size() == 0) {
      let createdAt = Time.now();
      let newAdminUser : AdminUser = {
        principal = caller;
        name;
        email;
        role = #admin;
        createdAt;
      };

      adminUsers.add(caller, newAdminUser);
      return newAdminUser;
    };

    // After first admin: only admins can create new admin users
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create admin users");
    };

    // Prevent duplicate admin registration
    switch (adminUsers.get(caller)) {
      case (?_existing) {
        Runtime.trap("Admin user already exists with this principal");
      };
      case (null) {};
    };

    let createdAt = Time.now();
    let newAdminUser : AdminUser = {
      principal = caller;
      name;
      email;
      role;
      createdAt;
    };

    adminUsers.add(caller, newAdminUser);
    newAdminUser;
  };

  public query ({ caller }) func getAllAdminUsers() : async [AdminUser] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all admin users");
    };
    adminUsers.values().toArray();
  };
};
