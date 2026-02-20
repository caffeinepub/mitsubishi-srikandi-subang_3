module {
  public type OldActor = {
    // All old state
  };
  public type NewActor = {
    // All new state
  };

  public func run(old : OldActor) : NewActor {
    // Perform migration logic here if schema changes
    old;
  };
};
