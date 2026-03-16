import Time "mo:core/Time";
import Map "mo:core/Map";
import Blob "mo:core/Blob";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Int "mo:core/Int";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  // V1: old type matching the existing canister stable var — used only for migration
  type WebsiteSettingsV1 = {
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

  // Base type used for stable storage — must NOT change fields to preserve upgrade compatibility
  type WebsiteSettingsBase = {
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
    salesConsultantName : ?Text;
    salesConsultantPhotoId : ?Nat;
    footerAboutText : ?Text;
  };

  // Full public API type — includes the 3 new fields stored in separate stable vars
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
    salesConsultantName : ?Text;
    salesConsultantPhotoId : ?Nat;
    footerAboutText : ?Text;
    mainBannerImageId2 : ?Nat;
    mainBannerVideoId : ?Nat;
    homepageBannerMode : ?Text;
  };


  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

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
  let idMapping = Map.empty<Text, Nat>();
  let vehicles = Map.empty<Nat, Vehicle>();
  let creditSimulations = Map.empty<Nat, CreditSimulation>();
  let bannerImages = Map.empty<Nat, BannerImage>();
  let metaStore = Map.empty<Text, MetaEntry>();

  // Old stable var — kept so Motoko can deserialize existing canister state on upgrade.
  // After postupgrade runs, websiteSettings_v2 is the source of truth.
  stable var websiteSettings : WebsiteSettingsV1 = {
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

  // New stable var holding extended settings. Null until first postupgrade migration.
  stable var websiteSettings_v2 : ?WebsiteSettingsBase = null;

  // Extra stable vars for fields added after v2 (separate to keep upgrade compatibility)
  stable var ws_ext_mainBannerImageId2 : ?Nat = null;
  stable var ws_ext_mainBannerVideoId : ?Nat = null;
  stable var ws_ext_homepageBannerMode : Text = "1 image";

  // Stable storage for media assets — persists across canister upgrades
  stable var stableMediaAssets : [MediaAsset] = [];
  stable var stableMediaAssetIdCounter : Nat = 1;

  // In-memory working copy used by all runtime functions.
  var _websiteSettingsRuntime : WebsiteSettingsBase = {
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
    salesConsultantName = null;
    salesConsultantPhotoId = null;
    footerAboutText = null;
  };

  let productLikes = Map.empty<Nat, ProductLike>();
  let productShares = Map.empty<Nat, ProductShare>();
  let articleComments = Map.empty<Nat, ArticleComment>();
  let contactSubmissions = Map.empty<Nat, ContactSubmission>();

  let visitorSessions = Map.empty<Text, VisitorSession>();
  let visits = Map.empty<Text, Visit>();
  let pageViewsMap = Map.empty<Text, Nat>();
  let dailySessionSet = Map.empty<Text, Bool>();

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

  public type UserRole = {
    #super_admin;
    #admin;
  };

  public type AdminRecord = {
    principal : Principal;
    role : UserRole;
    createdAt : Int;
    updatedAt : Int;
  };

  var adminStore : [(Principal, AdminRecord)] = [];
  let userProfiles = Map.empty<Principal, UserProfile>();

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
  var bannerImageIdCounter = 1;
  var likeCounter = 1;
  var shareCounter = 1;
  var commentCounter = 1;
  var contactCounter = 1;
  var visitIdCounter = 1;

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

  public type MetaEntry = {
    key : Text;
    value : Text;
    lastUpdated : Int;
  };

  func promoteToSuperAdmin(caller : Principal) {
    let currentAdmins = adminStore.map(
      func((principal, record)) {
        if (principal == caller) {
          (principal, { record with role = #super_admin });
        } else {
          (principal, record);
        };
      }
    );
    adminStore := currentAdmins;
  };

  func superAdminCount() : Nat {
    adminStore.filter(func((_, record)) { record.role == #super_admin }).size();
  };

  func bootstrapIfEmpty(caller : Principal) : Bool {
    if (adminStore.size() == 0) {
      let now = Time.now();
      let newAdmin : AdminRecord = {
        principal = caller;
        role = #super_admin;
        createdAt = now;
        updatedAt = now;
      };
      adminStore := [(caller, newAdmin)];
      return true;
    };
    false;
  };

  func recoverSuperAdminIfNeeded(caller : Principal) {
    if (superAdminCount() == 0) {
      switch (findAdminRecord(caller)) {
        case (?(_, _)) {
          promoteToSuperAdmin(caller);
        };
        case (null) {};
      };
    };
  };

  func findAdminRecord(p : Principal) : ?(Principal, AdminRecord) {
    adminStore.find(
      func((principal, _)) { principal == p }
    );
  };

  func callerIsSuperAdmin(caller : Principal) : Bool {
    switch (findAdminRecord(caller)) {
      case (?(_, record)) { record.role == #super_admin };
      case (null) { false };
    };
  };

  func callerIsAnyAdmin(caller : Principal) : Bool {
    switch (findAdminRecord(caller)) {
      case (?(_, _)) { true };
      case (null) { false };
    };
  };

  func isSuperAdmin(p : Principal) : Bool {
    switch (findAdminRecord(p)) {
      case (?(_, record)) { record.role == #super_admin };
      case (null) { false };
    };
  };

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

  func isThisYear(timestamp : Int, now : Int) : Bool {
    let nowNanos = now;
    let yearNanos = 365 * 24 * 60 * 60 * 1_000_000_000;
    (timestamp >= (nowNanos - yearNanos));
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

    let currentViewCount = switch (pageViewsMap.get(pageUrl)) {
      case (?count) { count };
      case (null) { 0 };
    };
    pageViewsMap.add(pageUrl, currentViewCount + 1);

    let dayKey = Int.abs(currentTime / (24 * 60 * 60 * 1_000_000_000)).toText();
    let dedupKey = sessionId # "-" # dayKey;
    let isNewSession = switch (dailySessionSet.get(dedupKey)) {
      case (null) {
        dailySessionSet.add(dedupKey, true);
        true;
      };
      case (?_) { false };
    };
    updateDailyStats(currentTime, isNewSession);

    visitorStats := recalculateStats();
  };

  func updateDailyStats(timestamp : Int, isNewSession : Bool) {
    let day = Int.abs((timestamp / (24 * 60 * 60 * 1_000_000_000)) * (24 * 60 * 60 * 1_000_000_000));
    switch (dailyStats.get(day)) {
      case (?existingStats) {
        let updatedStats = {
          existingStats with
          pageViews = existingStats.pageViews + 1;
          visitors = if (isNewSession) { existingStats.visitors + 1 } else { existingStats.visitors };
        };
        dailyStats.add(day, updatedStats);
      };
      case (null) {
        let newStats = {
          date = day;
          visitors = if (isNewSession) { 1 } else { 0 };
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

  func recalculateStats() : VisitorStats {
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

    let thisYearVisitors = visitorSessions.values().toArray().filter(
      func(session) { isThisYear(session.firstVisit, currentTime) }
    ).size();

    let pageViewsToday = visits.values().toArray().filter(
      func(visit) { isToday(visit.visitedAt, currentTime) }
    ).size();

    let onlineCount = visitorSessions.values().toArray().filter(
      func(session) {
        currentTime - session.lastActivity <= 5 * 60 * 1_000_000_000
      }
    ).size();

    {
      visitorStats with
      visitorsToday = todayVisitors;
      visitorsYesterday = yesterdayVisitors;
      visitorsThisWeek = thisWeekVisitors;
      visitorsThisMonth = thisMonthVisitors;
      visitorsThisYear = thisYearVisitors;
      onlineNow = onlineCount;
      pageViewsToday;
      totalVisitors = visitorSessions.size();
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

  public query func getPublicVisitorStats() : async VisitorStats {
    visitorStats;
  };

  public query func getDailyVisitorTrend() : async [(Int, Nat)] {
    let currentTime = Time.now();
    let trendList = dailyStats.toArray().filter(
      func((day, _)) { day >= (currentTime - 30 * 24 * 60 * 60 * 1_000_000_000) }
    );

    trendList.map(func((timestamp, stats)) { (timestamp, stats.visitors) });
  };

  public query func getTopPageViews() : async [(Text, Nat)] {
    let sorted = pageViewsMap.toArray().sort(
      func(a : (Text, Nat), b : (Text, Nat)) : { #less; #equal; #greater } {
        if (a.1 > b.1) { #less } else if (a.1 < b.1) { #greater } else {
          #equal;
        };
      }
    );
    let len = if (sorted.size() < 10) { sorted.size() } else { 10 };
    Array.tabulate<(Text, Nat)>(
      len,
      func(i) { sorted[i] }
    );
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


  // Public query — no auth required — allows anonymous visitors to load media assets for display
  public query func getPublicMediaAssetById(id : Nat) : async ?MediaAsset {
    mediaAssets.get(id);
  };

  public shared ({ caller }) func updateWebsiteSettings(newSettings : WebsiteSettings) : async () {
    switch (findAdminRecord(caller)) {
      case (?(_, admin)) {
        switch (admin.role) {
          case (#super_admin) { /* allow */ };
          case (_) { Runtime.trap("Unauthorized: super admin only can update website settings") };
        };
      };
      case (null) { Runtime.trap("Unauthorized: not an admin") };
    };
    // Save base fields to stable runtime var
    _websiteSettingsRuntime := {
      siteName = newSettings.siteName;
      contactPhone = newSettings.contactPhone;
      contactWhatsapp = newSettings.contactWhatsapp;
      contactEmail = newSettings.contactEmail;
      dealerAddress = newSettings.dealerAddress;
      operationalHours = newSettings.operationalHours;
      facebookUrl = newSettings.facebookUrl;
      instagramUrl = newSettings.instagramUrl;
      tiktokUrl = newSettings.tiktokUrl;
      youtubeUrl = newSettings.youtubeUrl;
      mainBannerImageId = newSettings.mainBannerImageId;
      ctaBannerImageId = newSettings.ctaBannerImageId;
      lastUpdated = Time.now();
      salesConsultantName = newSettings.salesConsultantName;
      salesConsultantPhotoId = newSettings.salesConsultantPhotoId;
      footerAboutText = newSettings.footerAboutText;
    };
    // Save extra fields to their own stable vars
    ws_ext_mainBannerImageId2 := newSettings.mainBannerImageId2;
    ws_ext_mainBannerVideoId := newSettings.mainBannerVideoId;
    ws_ext_homepageBannerMode := switch (newSettings.homepageBannerMode) {
      case (?m) { m };
      case (null) { "1 image" };
    };
  };

  public query func getWebsiteSettings() : async WebsiteSettings {
    {
      _websiteSettingsRuntime with
      mainBannerImageId2 = ws_ext_mainBannerImageId2;
      mainBannerVideoId = ws_ext_mainBannerVideoId;
      homepageBannerMode = ?ws_ext_homepageBannerMode;
    }
  };

  public shared ({ caller }) func getAdmins() : async [AdminRecord] {
    ignore bootstrapIfEmpty(caller);

    recoverSuperAdminIfNeeded(caller);

    if (not callerIsAnyAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can view the admin list");
    };

    adminStore.map(func((_, record)) { record });
  };

  public shared ({ caller }) func updateAdminRole(principal : Principal, newRole : UserRole) : async () {
    switch (findAdminRecord(caller)) {
      case (?(_, admin)) {
        switch (admin.role) {
          case (#super_admin) { /* allow — continue with existing logic */ };
          case (_) { Runtime.trap("Unauthorized: super admin only") };
        };
      };
      case (null) { Runtime.trap("Unauthorized: not an admin") };
    };

    ignore bootstrapIfEmpty(caller);

    recoverSuperAdminIfNeeded(caller);

    switch (findAdminRecord(principal)) {
      case (null) {
        Runtime.trap("Admin not found for the given principal");
      };
      case (?(_, existingRecord)) {
        let now = Time.now();
        let updatedRecord : AdminRecord = {
          existingRecord with
          role = newRole;
          updatedAt = now;
        };
        adminStore := adminStore.map(func((p, record)) {
          if (p == principal) {
            (p, updatedRecord);
          } else {
            (p, record);
          };
        });
      };
    };
  };

  public shared ({ caller }) func deleteAdmin(principal : Principal) : async () {
    if (not isSuperAdmin(caller)) {
      Runtime.trap("Unauthorized: Only super_admins can delete admins");
    };

    ignore bootstrapIfEmpty(caller);

    recoverSuperAdminIfNeeded(caller);

    if (adminStore.size() <= 1) {
      Runtime.trap("Cannot delete the last remaining admin");
    };

    switch (findAdminRecord(principal)) {
      case (null) {
        Runtime.trap("Admin not found for the given principal");
      };
      case (?_) {
        adminStore := adminStore.filter(func((p, _)) { p != principal });
      };
    };
  };

  public shared ({ caller }) func getMyRole() : async ?UserRole {
    ignore bootstrapIfEmpty(caller);

    recoverSuperAdminIfNeeded(caller);

    switch (findAdminRecord(caller)) {
      case (?(_, record)) { ?record.role };
      case (null) { null };
    };
  };

  public shared ({ caller }) func whoAmI() : async Text {
    caller.toText();
  };

  public shared ({ caller }) func forceSetMeAsSuperAdmin() : async Text {
    let found = findAdminRecord(caller);

    switch (found) {
      case (?(_p, _existingAdmin)) {
        adminStore := adminStore.map(
          func((p, adminRecord)) {
            if (p == caller) {
              (p, { adminRecord with role = #super_admin });
            } else {
              (p, adminRecord);
            };
          }
        );
        "Caller " # caller.toText() # " is now super_admin.";
      };
      case (null) {
        let now = Time.now();
        let newAdmin = {
          principal = caller;
          role = #super_admin;
          createdAt = now;
          updatedAt = now;
        };
        adminStore := Array.empty<(Principal, AdminRecord)>().concat([(caller, newAdmin)]);
        "Created new super admin " # caller.toText();
      };
    };
  };

  // --- Stable upgrade hooks for WebsiteSettings migration ---

  system func preupgrade() {
    // Persist the runtime settings into the v2 stable var before upgrade
    websiteSettings_v2 := ?_websiteSettingsRuntime;
    // Persist media assets to stable storage
    stableMediaAssets := mediaAssets.values().toArray();
    stableMediaAssetIdCounter := mediaAssetIdCounter;
  };

  system func postupgrade() {
    switch (websiteSettings_v2) {
      case (?saved) {
        // Already migrated — restore from v2 stable var
        _websiteSettingsRuntime := saved;
      };
      case (null) {
        // First upgrade: migrate from old V1 stable var
        _websiteSettingsRuntime := {
          siteName = websiteSettings.siteName;
          contactPhone = websiteSettings.contactPhone;
          contactWhatsapp = websiteSettings.contactWhatsapp;
          contactEmail = websiteSettings.contactEmail;
          dealerAddress = websiteSettings.dealerAddress;
          operationalHours = websiteSettings.operationalHours;
          facebookUrl = websiteSettings.facebookUrl;
          instagramUrl = websiteSettings.instagramUrl;
          tiktokUrl = websiteSettings.tiktokUrl;
          youtubeUrl = websiteSettings.youtubeUrl;
          mainBannerImageId = websiteSettings.mainBannerImageId;
          ctaBannerImageId = websiteSettings.ctaBannerImageId;
          lastUpdated = websiteSettings.lastUpdated;
          salesConsultantName = null;
          salesConsultantPhotoId = null;
          footerAboutText = null;
        };
        // Mark as migrated
        websiteSettings_v2 := ?_websiteSettingsRuntime;
      };
    };
    // Restore media assets from stable storage
    for (asset in stableMediaAssets.vals()) {
      mediaAssets.add(asset.id, asset);
    };
    mediaAssetIdCounter := stableMediaAssetIdCounter;
  };
};
