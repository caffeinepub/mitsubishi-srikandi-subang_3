import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";

module {
  type DailyStats = {
    date : Int;
    visitors : Nat;
    pageViews : Nat;
  };

  type VisitorSession = {
    sessionId : Text;
    ipAddress : Text;
    firstVisit : Int;
    lastActivity : Int;
    isOnline : Bool;
  };

  type Visit = {
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

  type Variant = {
    id : Nat;
    vehicleId : Nat;
    name : Text;
    displayOrder : Nat;
    overridePrice : ?Nat;
  };

  type Color = {
    id : Nat;
    vehicleId : Nat;
    name : Text;
    colorCode : ?Text;
    active : Bool;
  };

  type VariantColorMapping = {
    id : Nat;
    vehicleId : Nat;
    variantId : Nat;
    colorId : Nat;
    available : Bool;
  };

  type ArticleComment = {
    id : Nat;
    userId : Principal;
    articleId : Nat;
    content : Text;
    timestamp : Int;
  };

  type VehicleImage = {
    id : Nat;
    vehicleId : Nat;
    variantId : ?Nat;
    colorId : ?Nat;
    imageId : Text;
    default : Bool;
  };

  type Specification = {
    id : Nat;
    vehicleId : Nat;
    name : Text;
    value : Text;
  };

  type Feature = {
    id : Nat;
    vehicleId : Nat;
    name : Text;
    description : Text;
  };

  type CreditSimulation = {
    id : Nat;
    userId : Principal;
    vehicleId : Nat;
    amount : Nat;
    term : Nat;
    timestamp : Int;
  };

  type ProductLike = {
    id : Nat;
    userId : Principal;
    vehicleId : Nat;
    timestamp : Int;
  };

  type ProductShare = {
    id : Nat;
    userId : Principal;
    vehicleId : Nat;
    timestamp : Int;
  };

  type ContactSubmission = {
    id : Nat;
    userId : ?Principal;
    name : Text;
    email : Text;
    message : Text;
    timestamp : Int;
  };

  type Vehicle = {
    id : Nat;
    vehicleName : Text;
    description : Text;
    basePrice : Nat;
    publishStatus : Bool;
  };

  type VehicleCatalog = {
    vehicle : Vehicle;
    variants : [Variant];
    colors : [Color];
    variantColorMappings : [VariantColorMapping];
    images : [VehicleImage];
    specifications : [Specification];
    features : [Feature];
  };

  type Promotion = {
    id : Nat;
    title : Text;
    description : Text;
    imageId : ?Text;
    startDate : Int;
    endDate : Int;
    active : Bool;
  };

  type Testimonial = {
    id : Nat;
    customerName : Text;
    content : Text;
    rating : Nat;
    vehicleId : ?Nat;
    imageId : ?Text;
    approved : Bool;
    timestamp : Int;
  };

  type BlogPost = {
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

  type MediaAsset = {
    id : Nat;
    filename : Text;
    mimeType : Text;
    size : Nat;
    uploadedBy : Principal;
    uploadedAt : Int;
    data : Blob;
  };

  type CommercialVehicleCategory = {
    id : Nat;
    name : Text;
    description : Text;
    imageId : ?Text;
    displayOrder : Nat;
  };

  type AdminUser = {
    principal : Principal;
    name : Text;
    email : Text;
    role : AccessControl.UserRole;
    createdAt : Int;
  };

  type BannerImageType = {
    #mainBanner;
    #ctaBanner;
  };

  type BannerImage = {
    id : Nat;
    filename : Text;
    bannerType : BannerImageType;
    mimeType : Text;
    size : Nat;
    uploadedBy : Principal;
    uploadedAt : Int;
    data : Blob;
  };

  type WebsiteSettings = {
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

  type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  type VisitorStats = {
    totalVisitors : Nat;
    visitorsToday : Nat;
    visitorsYesterday : Nat;
    visitorsThisWeek : Nat;
    visitorsThisMonth : Nat;
    visitorsThisYear : Nat;
    onlineNow : Nat;
    pageViewsToday : Nat;
  };

  type OldActor = {
    variants : Map.Map<Nat, Variant>;
    colors : Map.Map<Nat, Color>;
    variantColorMappings : Map.Map<Nat, VariantColorMapping>;
    vehicleImages : Map.Map<Nat, VehicleImage>;
    specifications : Map.Map<Nat, Specification>;
    features : Map.Map<Nat, Feature>;
    promotions : Map.Map<Nat, Promotion>;
    testimonials : Map.Map<Nat, Testimonial>;
    blogPosts : Map.Map<Nat, BlogPost>;
    mediaAssets : Map.Map<Nat, MediaAsset>;
    commercialVehicleCategories : Map.Map<Nat, CommercialVehicleCategory>;
    adminUsers : Map.Map<Principal, AdminUser>;
    vehicles : Map.Map<Nat, Vehicle>;
    creditSimulations : Map.Map<Nat, CreditSimulation>;
    bannerImages : Map.Map<Nat, BannerImage>;
    userProfiles : Map.Map<Principal, UserProfile>;
    websiteSettings : WebsiteSettings;
    productLikes : Map.Map<Nat, ProductLike>;
    productShares : Map.Map<Nat, ProductShare>;
    articleComments : Map.Map<Nat, ArticleComment>;
    contactSubmissions : Map.Map<Nat, ContactSubmission>;
    visitorSessions : Map.Map<Text, VisitorSession>;
    visits : Map.Map<Text, Visit>;
    variantIdCounter : Nat;
    colorIdCounter : Nat;
    mappingIdCounter : Nat;
    imageIdCounter : Nat;
    specIdCounter : Nat;
    featureIdCounter : Nat;
    promotionIdCounter : Nat;
    testimonialIdCounter : Nat;
    blogPostIdCounter : Nat;
    mediaAssetIdCounter : Nat;
    commercialCategoryIdCounter : Nat;
    vehicleIdCounter : Nat;
    creditSimCounter : Nat;
    bannerImageIdCounter : Nat;
    likeCounter : Nat;
    shareCounter : Nat;
    commentCounter : Nat;
    contactCounter : Nat;
    visitIdCounter : Nat;
    visitorStats : VisitorStats;
    dailyStats : Map.Map<Int, DailyStats>;
  };

  type NewActor = {
    variants : Map.Map<Nat, Variant>;
    colors : Map.Map<Nat, Color>;
    variantColorMappings : Map.Map<Nat, VariantColorMapping>;
    vehicleImages : Map.Map<Nat, VehicleImage>;
    specifications : Map.Map<Nat, Specification>;
    features : Map.Map<Nat, Feature>;
    promotions : Map.Map<Nat, Promotion>;
    testimonials : Map.Map<Nat, Testimonial>;
    blogPosts : Map.Map<Nat, BlogPost>;
    mediaAssets : Map.Map<Nat, MediaAsset>;
    commercialVehicleCategories : Map.Map<Nat, CommercialVehicleCategory>;
    adminUsers : Map.Map<Principal, AdminUser>;
    vehicles : Map.Map<Nat, Vehicle>;
    creditSimulations : Map.Map<Nat, CreditSimulation>;
    bannerImages : Map.Map<Nat, BannerImage>;
    userProfiles : Map.Map<Principal, UserProfile>;
    websiteSettings : WebsiteSettings;
    productLikes : Map.Map<Nat, ProductLike>;
    productShares : Map.Map<Nat, ProductShare>;
    articleComments : Map.Map<Nat, ArticleComment>;
    contactSubmissions : Map.Map<Nat, ContactSubmission>;
    visitorSessions : Map.Map<Text, VisitorSession>;
    visits : Map.Map<Text, Visit>;
    variantIdCounter : Nat;
    colorIdCounter : Nat;
    mappingIdCounter : Nat;
    imageIdCounter : Nat;
    specIdCounter : Nat;
    featureIdCounter : Nat;
    promotionIdCounter : Nat;
    testimonialIdCounter : Nat;
    blogPostIdCounter : Nat;
    mediaAssetIdCounter : Nat;
    commercialCategoryIdCounter : Nat;
    vehicleIdCounter : Nat;
    creditSimCounter : Nat;
    bannerImageIdCounter : Nat;
    likeCounter : Nat;
    shareCounter : Nat;
    commentCounter : Nat;
    contactCounter : Nat;
    visitIdCounter : Nat;
    visitorStats : VisitorStats;
    dailyStats : Map.Map<Int, DailyStats>;
  };

  public func run(old : OldActor) : NewActor {
    old;
  };
};
