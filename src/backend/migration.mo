module {
  type OldActor = { /* old state */ };
  type NewActor = { /* new state */ };

  public func run(old : OldActor) : NewActor {
    // No changes needed, just migrate state
    { old };
  };
};
