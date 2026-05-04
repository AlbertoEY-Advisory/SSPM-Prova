Branching rules:
    main → production baseline.
    feat/<short-description> → new policies or refactors.
    fix/<short-description> → corrections or urgent fixes.
Release tags:
    YYYY.MM.0 for initial baseline.
    Increment patch for additional releases during same month (2025.11.1, etc.).
Basic workflow:
    Create feature branch.
    Implement YAML changes.
    Open PR with template.
    Manager approves.
    Merge to main.
    (Optional) Tag a release when a significant batch is merged.