import Map "mo:core/Map";
import Set "mo:core/Set";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
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

  type OldActor = {
    visitorStats : VisitorStats;
    dailyStatsMap : Map.Map<Int, { date : Int; visitors : Nat; pageViews : Nat }>;
    onlineUsersSet : Set.Set<Principal>;
    sessionStorage : Map.Map<Principal, {
      principal : Principal;
      tokens : {
        idToken : Text;
        accessToken : Text;
        refreshToken : Text;
        expiresAt : Int;
      };
      createdAt : Int;
      lastSyncAt : Int;
    }>;
  };
  type NewActor = {
    visitorStats : VisitorStats;
    visitorSessions : Map.Map<Text, VisitorSession>;
    visits : Map.Map<Text, Visit>;
  };

  // Migration function called by the main actor via the with-clause
  public func run(old : OldActor) : NewActor {
    {
      old with
      visitorSessions = Map.empty<Text, VisitorSession>();
      visits = Map.empty<Text, Visit>();
    };
  };
};
