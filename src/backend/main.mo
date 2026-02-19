import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Time "mo:core/Time";

actor {
  include MixinStorage();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  // Data Models
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
  };

  public type Vehicle = {
    id : Nat;
    vehicleName : Text;
    description : Text;
    basePrice : Nat;
    publishStatus : Bool;
  };

  public type VisitorStats = {
    totalVisitors : Nat;
    dailyVisitors : Nat;
    weeklyVisitors : Nat;
    monthlyVisitors : Nat;
    pageViews : Nat;
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

  public type ArticleComment = {
    id : Nat;
    userId : Principal;
    articleId : Nat;
    content : Text;
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

  // In-memory persistent storage
  let userProfiles = Map.empty<Principal, UserProfile>();
  let websiteSettingsMap = Map.empty<Nat, WebsiteSettings>();
  let vehiclesMap = Map.empty<Nat, Vehicle>();
  let creditSimulations = Map.empty<Nat, CreditSimulation>();
  let productLikes = Map.empty<Nat, ProductLike>();
  let articleComments = Map.empty<Nat, ArticleComment>();
  let contactSubmissions = Map.empty<Nat, ContactSubmission>();
  
  var vehicleIdCounter = 1;
  var creditSimCounter = 1;
  var likeCounter = 1;
  var commentCounter = 1;
  var contactCounter = 1;

  // ============================================
  // USER PROFILE MANAGEMENT (Required by Frontend)
  // ============================================

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
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

  // ============================================
  // WEBSITE SETTINGS (Admin-only write, Public read)
  // ============================================

  public shared ({ caller }) func saveWebsiteSettings(settings : WebsiteSettings) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can modify website settings");
    };
    websiteSettingsMap.add(settings.id, settings);
  };

  public query func getWebsiteSettings(id : Nat) : async ?WebsiteSettings {
    // Public read access - no authentication required
    websiteSettingsMap.get(id);
  };

  // ============================================
  // VEHICLE MANAGEMENT (Admin-only write, Public read for published)
  // ============================================

  public shared ({ caller }) func addVehicle(vehicle : Vehicle) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add vehicles");
    };
    let newVehicle = {
      id = vehicleIdCounter;
      vehicleName = vehicle.vehicleName;
      description = vehicle.description;
      basePrice = vehicle.basePrice;
      publishStatus = vehicle.publishStatus;
    };
    vehiclesMap.add(vehicleIdCounter, newVehicle);
    vehicleIdCounter += 1;
    vehicleIdCounter - 1;
  };

  public shared ({ caller }) func updateVehicle(id : Nat, vehicle : Vehicle) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update vehicles");
    };
    switch (vehiclesMap.get(id)) {
      case (null) { Runtime.trap("Vehicle not found") };
      case (?_) {
        vehiclesMap.add(id, vehicle);
      };
    };
  };

  public shared ({ caller }) func deleteVehicle(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete vehicles");
    };
    vehiclesMap.remove(id);
  };

  public query func getVehicle(id : Nat) : async ?Vehicle {
    // Public can view published vehicles only
    switch (vehiclesMap.get(id)) {
      case (null) { null };
      case (?vehicle) {
        if (vehicle.publishStatus) {
          ?vehicle;
        } else {
          null;
        };
      };
    };
  };

  public query ({ caller }) func getVehicleAdmin(id : Nat) : async ?Vehicle {
    // Admins can view unpublished vehicles
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view unpublished vehicles");
    };
    vehiclesMap.get(id);
  };

  public query func getAllVehiclePreviews() : async [Vehicle] {
    // Public can only see published vehicles
    vehiclesMap.values().toArray().filter<Vehicle>(
      func(v : Vehicle) : Bool { v.publishStatus }
    );
  };

  public query ({ caller }) func getAllVehiclesAdmin() : async [Vehicle] {
    // Admins can see all vehicles including unpublished
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all vehicles");
    };
    vehiclesMap.values().toArray();
  };

  // ============================================
  // CREDIT SIMULATIONS (User-only, own data)
  // ============================================

  public shared ({ caller }) func createCreditSimulation(vehicleId : Nat, amount : Nat, term : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create credit simulations");
    };
    let simulation = {
      id = creditSimCounter;
      userId = caller;
      vehicleId = vehicleId;
      amount = amount;
      term = term;
      timestamp = Time.now();
    };
    creditSimulations.add(creditSimCounter, simulation);
    creditSimCounter += 1;
    creditSimCounter - 1;
  };

  public query ({ caller }) func getMyCreditSimulations() : async [CreditSimulation] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view credit simulations");
    };
    creditSimulations.values().toArray().filter<CreditSimulation>(
      func(sim : CreditSimulation) : Bool { sim.userId == caller }
    );
  };

  public query ({ caller }) func getAllCreditSimulations() : async [CreditSimulation] {
    // Admin-only: view all credit simulations
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all credit simulations");
    };
    creditSimulations.values().toArray();
  };

  // ============================================
  // PRODUCT LIKES (User-only, own actions)
  // ============================================

  public shared ({ caller }) func likeProduct(vehicleId : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can like products");
    };
    let like = {
      id = likeCounter;
      userId = caller;
      vehicleId = vehicleId;
      timestamp = Time.now();
    };
    productLikes.add(likeCounter, like);
    likeCounter += 1;
    likeCounter - 1;
  };

  public shared ({ caller }) func unlikeProduct(likeId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can unlike products");
    };
    switch (productLikes.get(likeId)) {
      case (null) { Runtime.trap("Like not found") };
      case (?like) {
        if (like.userId != caller) {
          Runtime.trap("Unauthorized: Can only unlike your own likes");
        };
        productLikes.remove(likeId);
      };
    };
  };

  public query func getProductLikes(vehicleId : Nat) : async [ProductLike] {
    // Public can view like count
    productLikes.values().toArray().filter<ProductLike>(
      func(like : ProductLike) : Bool { like.vehicleId == vehicleId }
    );
  };

  // ============================================
  // ARTICLE COMMENTS (User-only, own comments)
  // ============================================

  public shared ({ caller }) func addArticleComment(articleId : Nat, content : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can comment on articles");
    };
    let comment = {
      id = commentCounter;
      userId = caller;
      articleId = articleId;
      content = content;
      timestamp = Time.now();
    };
    articleComments.add(commentCounter, comment);
    commentCounter += 1;
    commentCounter - 1;
  };

  public shared ({ caller }) func deleteArticleComment(commentId : Nat) : async () {
    switch (articleComments.get(commentId)) {
      case (null) { Runtime.trap("Comment not found") };
      case (?comment) {
        // Users can delete their own comments, admins can delete any
        if (comment.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only delete your own comments");
        };
        articleComments.remove(commentId);
      };
    };
  };

  public query func getArticleComments(articleId : Nat) : async [ArticleComment] {
    // Public can view comments
    articleComments.values().toArray().filter<ArticleComment>(
      func(comment : ArticleComment) : Bool { comment.articleId == articleId }
    );
  };

  // ============================================
  // CONTACT SUBMISSIONS (User or Guest, Admin read)
  // ============================================

  public shared ({ caller }) func submitContactForm(name : Text, email : Text, message : Text) : async Nat {
    // Any user including guests can submit contact forms
    let userId = if (caller.isAnonymous()) {
      null;
    } else {
      ?caller;
    };
    let submission = {
      id = contactCounter;
      userId = userId;
      name = name;
      email = email;
      message = message;
      timestamp = Time.now();
    };
    contactSubmissions.add(contactCounter, submission);
    contactCounter += 1;
    contactCounter - 1;
  };

  public query ({ caller }) func getAllContactSubmissions() : async [ContactSubmission] {
    // Admin-only: view all contact submissions
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view contact submissions");
    };
    contactSubmissions.values().toArray();
  };

  // ============================================
  // VISITOR STATISTICS (Public read, Auto-update)
  // ============================================

  var visitorStats : VisitorStats = {
    totalVisitors = 0;
    dailyVisitors = 0;
    weeklyVisitors = 0;
    monthlyVisitors = 0;
    pageViews = 0;
  };

  public func incrementPageView() : async () {
    // Public endpoint - no authentication required
    visitorStats := {
      totalVisitors = visitorStats.totalVisitors;
      dailyVisitors = visitorStats.dailyVisitors;
      weeklyVisitors = visitorStats.weeklyVisitors;
      monthlyVisitors = visitorStats.monthlyVisitors;
      pageViews = visitorStats.pageViews + 1;
    };
  };

  public query func getVisitorStats() : async VisitorStats {
    // Public read access
    visitorStats;
  };

  public shared ({ caller }) func resetVisitorStats() : async () {
    // Admin-only
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reset visitor statistics");
    };
    visitorStats := {
      totalVisitors = 0;
      dailyVisitors = 0;
      weeklyVisitors = 0;
      monthlyVisitors = 0;
      pageViews = 0;
    };
  };
};
