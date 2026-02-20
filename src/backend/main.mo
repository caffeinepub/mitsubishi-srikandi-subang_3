import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import OutCall "http-outcalls/outcall";
import MixinAuthorization "authorization/MixinAuthorization";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Time "mo:core/Time";
import List "mo:core/List";
import Text "mo:core/Text";
import Int "mo:core/Int";



actor {
  include MixinStorage();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

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

  let sessionStorage = Map.empty<Principal, SessionStorage>();

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
    dailyVisitors : Nat;
    weeklyVisitors : Nat;
    monthlyVisitors : Nat;
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

  var visitorStats : VisitorStats = {
    totalVisitors = 0;
    dailyVisitors = 0;
    weeklyVisitors = 0;
    monthlyVisitors = 0;
    pageViews = 0;
  };

  // Helper Functions

  func incrementTotalVisitors() {
    visitorStats := {
      totalVisitors = visitorStats.totalVisitors + 1;
      dailyVisitors = visitorStats.dailyVisitors + 1;
      weeklyVisitors = visitorStats.weeklyVisitors + 1;
      monthlyVisitors = visitorStats.monthlyVisitors + 1;
      pageViews = visitorStats.pageViews;
    };
  };

  func incrementPageViews() {
    visitorStats := {
      totalVisitors = visitorStats.totalVisitors;
      dailyVisitors = visitorStats.dailyVisitors;
      weeklyVisitors = visitorStats.weeklyVisitors;
      monthlyVisitors = visitorStats.monthlyVisitors;
      pageViews = visitorStats.pageViews + 1;
    };
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

  // Variant Management - Admin only
  public shared ({ caller }) func createVariant(vehicleId : Nat, name : Text, displayOrder : Nat, overridePrice : ?Nat) : async Variant {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create variants");
    };
    let newVariant : Variant = {
      id = variantIdCounter;
      vehicleId;
      name;
      displayOrder;
      overridePrice;
    };
    variants.add(variantIdCounter, newVariant);
    variantIdCounter += 1;
    newVariant;
  };

  // Media Asset Management - Admin only
  public shared ({ caller }) func uploadMediaAsset(filename : Text, assetId : Text, mimeType : Text, size : Nat) : async MediaAsset {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can upload media assets");
    };
    let newMediaAsset : MediaAsset = {
      id = mediaAssetIdCounter;
      filename;
      assetId;
      mimeType;
      size;
      uploadedBy = caller;
      uploadedAt = Time.now();
    };
    mediaAssets.add(mediaAssetIdCounter, newMediaAsset);
    mediaAssetIdCounter += 1;
    newMediaAsset;
  };

  // Blog Post Management - Admin only for create/update
  public shared ({ caller }) func createBlogPost(title : Text, content : Text, excerpt : Text, authorId : Principal, imageId : ?Text, published : Bool, publishedAt : ?Int) : async BlogPost {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create blog posts");
    };
    let newBlogPost : BlogPost = {
      id = blogPostIdCounter;
      title;
      content;
      excerpt;
      authorId;
      imageId;
      published;
      publishedAt;
      createdAt = Time.now();
      updatedAt = Time.now();
    };
    blogPosts.add(blogPostIdCounter, newBlogPost);
    blogPostIdCounter += 1;
    newBlogPost;
  };

  public shared ({ caller }) func updateBlogPost(id : Nat, title : Text, content : Text, excerpt : Text, authorId : Principal, imageId : ?Text, published : Bool, publishedAt : ?Int) : async ?BlogPost {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update blog posts");
    };
    switch (blogPosts.get(id)) {
      case (null) { null };
      case (?existing) {
        let updated : BlogPost = {
          id;
          title;
          content;
          excerpt;
          authorId;
          imageId;
          published;
          publishedAt;
          createdAt = existing.createdAt;
          updatedAt = Time.now();
        };
        blogPosts.add(id, updated);
        ?updated;
      };
    };
  };

  // Public read access, but unpublished posts only visible to admins
  public query ({ caller }) func getBlogPosts(start : Nat, limit : Nat, publishedFilter : ?Bool) : async [BlogPost] {
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let posts = List.empty<BlogPost>();

    let iter = blogPosts.values();

    switch (publishedFilter) {
      case (?published) {
        iter.forEach(
          func(post) {
            if (post.published == published) {
              // Only show unpublished posts to admins
              if (published or isAdmin) {
                posts.add(post);
              };
            };
          }
        );
      };
      case (null) {
        iter.forEach(
          func(post) {
            // Only show unpublished posts to admins
            if (post.published or isAdmin) {
              posts.add(post);
            };
          }
        );
      };
    };

    let postsArray = posts.toArray();
    let end = if ((start + limit) > postsArray.size()) { postsArray.size() } else {
      start + limit;
    };
    postsArray.sliceToArray(start, end);
  };

  // Visitor Stats - Admin only
  public query ({ caller }) func getVisitorStats() : async VisitorStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view visitor stats");
    };
    visitorStats;
  };

  // Public visitor tracking (no auth needed)
  public shared func trackVisitor() : async () {
    incrementTotalVisitors();
  };

  public shared func trackPageView() : async () {
    incrementPageViews();
  };
};
