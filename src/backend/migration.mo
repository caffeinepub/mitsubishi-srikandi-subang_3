import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Blob "mo:core/Blob";
import Principal "mo:core/Principal";

module {
  public type OldActor = {
    mediaAssets : Map.Map<Nat, { id : Nat; filename : Text; mimeType : Text; size : Nat; uploadedBy : Principal; uploadedAt : Int; data : Blob }>;
  };

  public type NewActor = {
    mediaAssets : Map.Map<Nat, { id : Nat; filename : Text; mimeType : Text; size : Nat; uploadedBy : Principal; uploadedAt : Int; data : Blob }>;
  };

  public func run(old : OldActor) : NewActor {
    old;
  };
};
