import Migration "migration";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Blob "mo:core/Blob";

import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

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

  public type GoogleTokens = {
    idToken : Text;
    accessToken : Text;
    refreshToken : Text;
    expiresAt : Int;
  };

  public type SessionStorage = {
    principal : Principal;
    tokens : GoogleTokens;
    createdAt : Int;
    lastSyncAt : Int;
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
    filename : Text;
    bannerType : BannerImageType;
    mimeType : Text;
    size : Nat;
    uploadedBy : Principal;
    uploadedAt : Int;
    blobData : Blob;
  };

  public type WebsiteSettings = {
    id : Nat;
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
    mainBanner : ?BannerImage;
    ctaBanner : ?BannerImage;
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

  let variants = Map.empty<Nat, Variant>();
  let colors = Map.empty<Nat, Color>();
  let variantColorMappings = Map.empty<Nat, VariantColorMapping>();
  let vehicleImages = Map.empty<Nat, VehicleImage>();
  let specifications = Map.empty<Nat, Specification>();
  let features = Map.empty<Nat, Feature>();
  let promotions = Map.empty<Nat, Promotion>();
  let testimonials = Map.empty<Nat, Testimonial>();
  let blogPosts = Map.empty<Nat, BlogPost>();
  let mediaAssets = Map.empty<Nat, MediaAsset>();
  let commercialVehicleCategories = Map.empty<Nat, CommercialVehicleCategory>();
  let adminUsers = Map.empty<Principal, AdminUser>();
  let vehicles = Map.empty<Nat, Vehicle>();
  let creditSimulations = Map.empty<Nat, CreditSimulation>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let websiteSettingsMap = Map.empty<Nat, WebsiteSettings>();
  let productLikes = Map.empty<Nat, ProductLike>();
  let productShares = Map.empty<Nat, ProductShare>();
  let articleComments = Map.empty<Nat, ArticleComment>();
  let contactSubmissions = Map.empty<Nat, ContactSubmission>();

  let visitorSessions = Map.empty<Text, VisitorSession>();
  let visits = Map.empty<Text, Visit>();

  var variantIdCounter = 1;
  var colorIdCounter = 1;
  var mappingIdCounter = 1;
  var imageIdCounter = 1;
  var specIdCounter = 1;
  var featureIdCounter = 1;
  var promotionIdCounter = 1;
  var testimonialIdCounter = 1;
  var blogPostIdCounter = 1;
  var mediaAssetIdCounter = 1;
  var commercialCategoryIdCounter = 1;
  var vehicleIdCounter = 1;
  var creditSimCounter = 1;
  var likeCounter = 1;
  var shareCounter = 1;
  var commentCounter = 1;
  var contactCounter = 1;
  var visitIdCounter = 1;

  var visitorStats : VisitorStats = {
    totalVisitors = 0;
    visitorsToday = 0;
    visitorsYesterday = 0;
    visitorsThisWeek = 0;
    visitorsThisMonth = 0;
    visitorsThisYear = 0;
    onlineNow = 0;
    pageViewsToday = 0;
  };

  let dailyStats = Map.empty<Int, DailyStats>();

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

  // User Profile Management (Required by instructions)
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

  func cleanupExpiredSessionsInternal() {
    let currentTime = Time.now();
    let timeout = 5 * 60 * 1_000_000_000; // 5 minutes in nanoseconds

    for ((sessionId, session) in visitorSessions.entries()) {
      if (currentTime - session.lastActivity > timeout and session.isOnline) {
        let updatedSession = { session with isOnline = false };
        visitorSessions.add(sessionId, updatedSession);
      };
    };
  };

  // Visitor Tracking - Public access for anonymous visitors (NO AUTHORIZATION CHECK)
  // This must be accessible to all users including anonymous guests for tracking to work
  public shared func trackVisitor(
    sessionId : Text,
    ipAddress : Text,
    userAgent : Text,
    pageUrl : Text,
    referrer : Text,
    deviceType : Text,
    browser : Text,
  ) : async () {
    // NO AUTHORIZATION CHECK - Must be accessible to anonymous visitors
    // as per implementation plan: "without requiring authentication"
    let currentTime = Time.now();

    // Create a new visit record
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

    // Update or create visitor session
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

    // Cleanup expired sessions inline (as per implementation plan)
    cleanupExpiredSessionsInternal();

    // Update daily stats
    updateDailyStats(currentTime);

    // Update visitor statistics with correct daily values
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

  // Keeping this method for compatibility (filtering by id)
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete media assets");
    };

    let existed = mediaAssets.containsKey(id);
    if (not existed) {
      return false;
    };

    mediaAssets.remove(id);
    true;
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
};
