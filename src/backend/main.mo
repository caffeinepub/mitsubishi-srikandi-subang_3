import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Migration "migration";
import List "mo:core/List";
import Set "mo:core/Set";

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
    assetId : Text;
    mimeType : Text;
    size : Nat;
    uploadedBy : Principal;
    uploadedAt : Int;
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
    todayVisitors : Nat;
    yesterdayVisitors : Nat;
    weeklyVisitors : Nat;
    monthlyVisitors : Nat;
    yearlyVisitors : Nat;
    onlineUsers : Nat;
    pageViews : Nat;
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

  stable var visitorStats : VisitorStats = {
    totalVisitors = 0;
    todayVisitors = 0;
    yesterdayVisitors = 0;
    weeklyVisitors = 0;
    monthlyVisitors = 0;
    yearlyVisitors = 0;
    onlineUsers = 0;
    pageViews = 0;
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

  // Visitor Tracking - Public access for anonymous visitors

  public shared func trackVisitor(
    sessionId : Text,
    ipAddress : Text,
    userAgent : Text,
    pageUrl : Text,
    referrer : Text,
    deviceType : Text,
    browser : Text,
  ) : async () {
    // No authorization check - must be accessible to anonymous visitors
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
  };

  public shared ({ caller }) func cleanupExpiredSessions() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can cleanup expired sessions");
    };

    let currentTime = Time.now();
    let timeout = 5 * 60 * 1_000_000_000; // 5 minutes in nanoseconds

    for ((sessionId, session) in visitorSessions.entries()) {
      if (currentTime - session.lastActivity > timeout and session.isOnline) {
        let updatedSession = { session with isOnline = false };
        visitorSessions.add(sessionId, updatedSession);
      };
    };
  };

  // Statistics Calculations - Admin only (sensitive business intelligence)

  public query ({ caller }) func getTotalVisitors() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view visitor statistics");
    };
    visitorSessions.size();
  };

  public query ({ caller }) func getTodayVisitors() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view visitor statistics");
    };

    let currentTime = Time.now();
    let oneDay = 24 * 60 * 60 * 1_000_000_000;

    visitorSessions.values().toArray().filter(func(session) { session.firstVisit >= (currentTime - oneDay) }).size();
  };

  public query ({ caller }) func getYesterdayVisitors() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view visitor statistics");
    };

    let currentTime = Time.now();
    let oneDay = 24 * 60 * 60 * 1_000_000_000;
    let yesterdayStart = currentTime - (2 * oneDay);

    visitorSessions.values().toArray().filter(func(session) { session.firstVisit >= yesterdayStart and session.firstVisit < (yesterdayStart + oneDay) }).size();
  };

  public query ({ caller }) func getWeeklyVisitors() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view visitor statistics");
    };

    let currentTime = Time.now();
    let oneWeek = 7 * 24 * 60 * 60 * 1_000_000_000;

    visitorSessions.values().toArray().filter(func(session) { session.firstVisit >= (currentTime - oneWeek) }).size();
  };

  public query ({ caller }) func getMonthlyVisitors() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view visitor statistics");
    };

    let currentTime = Time.now();
    let oneMonth = 30 * 24 * 60 * 60 * 1_000_000_000;

    visitorSessions.values().toArray().filter(func(session) { session.firstVisit >= (currentTime - oneMonth) }).size();
  };

  public query ({ caller }) func getYearlyVisitors() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view visitor statistics");
    };

    let currentTime = Time.now();
    let oneYear = 365 * 24 * 60 * 60 * 1_000_000_000;

    visitorSessions.values().toArray().filter(func(session) { session.firstVisit >= (currentTime - oneYear) }).size();
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

  public query ({ caller }) func getPageViewsByUrl() : async [(Text, Nat)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view visitor statistics");
    };

    let pageViewCounts = Map.empty<Text, Nat>();

    for ((_, visit) in visits.entries()) {
      switch (pageViewCounts.get(visit.pageUrl)) {
        case (?count) {
          pageViewCounts.add(visit.pageUrl, count + 1);
        };
        case (null) {
          pageViewCounts.add(visit.pageUrl, 1);
        };
      };
    };

    pageViewCounts.toArray();
  };

  public query ({ caller }) func getVisitorTrendLast30Days() : async [(Int, Nat)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view visitor statistics");
    };

    let currentTime = Time.now();
    let oneDay = 24 * 60 * 60 * 1_000_000_000;

    let dailyCounts = Map.empty<Int, Nat>();

    for ((_, visit) in visits.entries()) {
      let day = Int.abs((visit.visitedAt / oneDay) * oneDay);

      switch (dailyCounts.get(day)) {
        case (?count) {
          dailyCounts.add(day, count + 1);
        };
        case (null) {
          dailyCounts.add(day, 1);
        };
      };
    };

    let startTime = currentTime - (30 * oneDay);

    dailyCounts.toArray().filter(func((day, _)) { day >= startTime });
  };

  public query ({ caller }) func getVisitorStats() : async VisitorStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view visitor statistics");
    };

    let currentTime = Time.now();
    let oneDay = 24 * 60 * 60 * 1_000_000_000;
    let oneWeek = 7 * 24 * 60 * 60 * 1_000_000_000;
    let oneMonth = 30 * 24 * 60 * 60 * 1_000_000_000;
    let oneYear = 365 * 24 * 60 * 60 * 1_000_000_000;
    let timeout = 5 * 60 * 1_000_000_000;
    let yesterdayStart = currentTime - (2 * oneDay);

    let stats : VisitorStats = {
      totalVisitors = visitorSessions.size();
      todayVisitors = visitorSessions.values().toArray().filter(func(session) { session.firstVisit >= (currentTime - oneDay) }).size();
      yesterdayVisitors = visitorSessions.values().toArray().filter(func(session) { session.firstVisit >= yesterdayStart and session.firstVisit < (yesterdayStart + oneDay) }).size();
      weeklyVisitors = visitorSessions.values().toArray().filter(func(session) { session.firstVisit >= (currentTime - oneWeek) }).size();
      monthlyVisitors = visitorSessions.values().toArray().filter(func(session) { session.firstVisit >= (currentTime - oneMonth) }).size();
      yearlyVisitors = visitorSessions.values().toArray().filter(func(session) { session.firstVisit >= (currentTime - oneYear) }).size();
      onlineUsers = visitorSessions.values().toArray().filter(func(session) {
        currentTime - session.lastActivity <= timeout and session.isOnline
      }).size();
      pageViews = visits.size();
    };
    stats;
  };

  // Periodic Cleanup - Admin only
  public shared ({ caller }) func periodicCleanup() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can trigger periodic cleanup");
    };

    await cleanupExpiredSessions();
  };

  // Admin-only function to get all visitor sessions
  public query ({ caller }) func getAllVisitorSessions() : async [VisitorSession] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all visitor sessions");
    };
    visitorSessions.values().toArray();
  };

  // Admin-only function to get all visits
  public query ({ caller }) func getAllVisits() : async [Visit] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all visits");
    };
    visits.values().toArray();
  };
};
