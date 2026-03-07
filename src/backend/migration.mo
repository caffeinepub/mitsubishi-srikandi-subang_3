import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Blob "mo:core/Blob";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";

module {
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

  public type MetaEntry = {
    key : Text;
    value : Text;
    lastUpdated : Int;
  };

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
    idMapping : Map.Map<Text, Nat>;
    vehicles : Map.Map<Nat, Vehicle>;
    creditSimulations : Map.Map<Nat, CreditSimulation>;
    bannerImages : Map.Map<Nat, BannerImage>;
    metaStore : Map.Map<Text, MetaEntry>;
    websiteSettings : WebsiteSettings;
    productLikes : Map.Map<Nat, ProductLike>;
    productShares : Map.Map<Nat, ProductShare>;
    articleComments : Map.Map<Nat, ArticleComment>;
    contactSubmissions : Map.Map<Nat, ContactSubmission>;
    visitorSessions : Map.Map<Text, VisitorSession>;
    visits : Map.Map<Text, Visit>;
    visitorStats : VisitorStats;
    dailyStats : Map.Map<Int, DailyStats>;
    adminStore : [(Principal, AdminRecord)];
    userProfiles : Map.Map<Principal, UserProfile>;
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
  };

  public type NewActor = {
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
    idMapping : Map.Map<Text, Nat>;
    vehicles : Map.Map<Nat, Vehicle>;
    creditSimulations : Map.Map<Nat, CreditSimulation>;
    bannerImages : Map.Map<Nat, BannerImage>;
    metaStore : Map.Map<Text, MetaEntry>;
    websiteSettings : WebsiteSettings;
    productLikes : Map.Map<Nat, ProductLike>;
    productShares : Map.Map<Nat, ProductShare>;
    articleComments : Map.Map<Nat, ArticleComment>;
    contactSubmissions : Map.Map<Nat, ContactSubmission>;
    visitorSessions : Map.Map<Text, VisitorSession>;
    visits : Map.Map<Text, Visit>;
    pageViewsMap : Map.Map<Text, Nat>;
    dailySessionSet : Map.Map<Text, Bool>;
    visitorStats : VisitorStats;
    dailyStats : Map.Map<Int, DailyStats>;
    adminStore : [(Principal, AdminRecord)];
    userProfiles : Map.Map<Principal, UserProfile>;
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
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      pageViewsMap = Map.empty<Text, Nat>();
      dailySessionSet = Map.empty<Text, Bool>();
    };
  };
};
