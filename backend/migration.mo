import Array "mo:core/Array";
import Principal "mo:core/Principal";

module {
  public type UserRole = {
    #super_admin;
    #admin;
  };

  public type AdminRecord = {
    principal : Principal.Principal;
    role : UserRole;
    createdAt : Int;
    updatedAt : Int;
  };

  public type OldActor = {
    adminStore : [(Principal.Principal, AdminRecord)];
  };

  public type NewActor = {
    adminStore : [(Principal.Principal, AdminRecord)];
  };

  public func run(old : OldActor) : NewActor {
    let hasSuperAdmin = old.adminStore.any(
      func((_, record)) {
        record.role == #super_admin;
      }
    );

    let updatedAdmins = switch (hasSuperAdmin) {
      case (true) {
        // At least one super_admin already exists; keep as-is
        old.adminStore;
      };
      case (false) {
        switch (old.adminStore.size()) {
          case (0) {
            // Empty store; nothing to migrate
            [];
          };
          case (_) {
            // No super_admin found after migration — promote the first record
            let (firstPrincipal, firstRecord) = old.adminStore[0];
            let promotedFirst = {
              firstRecord with
              role = #super_admin;
            };
            [(firstPrincipal, promotedFirst)].concat(old.adminStore.sliceToArray(1, old.adminStore.size()));
          };
        };
      };
    };

    { adminStore = updatedAdmins };
  };
};
