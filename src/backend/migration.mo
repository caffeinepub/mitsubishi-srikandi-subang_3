import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Array "mo:core/Array";

module {
  // Types from previous state
  type OldMediaAsset = {
    id : Nat;
    filename : Text;
    assetId : Text;
    mimeType : Text;
    size : Nat;
    uploadedBy : Principal;
    uploadedAt : Int;
  };

  type OldActor = {
    mediaAssets : Map.Map<Nat, OldMediaAsset>;
  };

  // Types for new state
  type NewMediaAsset = {
    id : Nat;
    filename : Text;
    blobId : Text;
    mimeType : Text;
    size : Nat;
    uploadedBy : Principal;
    uploadedAt : Int;
  };

  // New actor state after migration
  type NewActor = {
    mediaAssets : Map.Map<Nat, NewMediaAsset>;
  };

  // Migration function
  public func run(old : OldActor) : NewActor {
    let newMediaAssets = old.mediaAssets.map<Nat, OldMediaAsset, NewMediaAsset>(
      func(_id, oldAsset) {
        // Direct mapping of assetId to blobId
        {
          oldAsset
          with
          blobId = oldAsset.assetId;
        };
      }
    );
    { mediaAssets = newMediaAssets };
  };
};
