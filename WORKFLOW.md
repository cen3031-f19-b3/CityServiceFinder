# Workflow

The following process should be used for adding new features and bug-fixes:

1. Create a new branch for your feature.
   * Branch off of DEVELOP, not MASTER.
   * Give your branch a descriptive name - for example, feature/my-feature or bugfix/fix-broken-thing
1. Make changes within this branch, and then push them to your feature branch on the repository.
1. Open a pull request and REQUEST REVIEW from at least one other person.
1. Once reviews are approved and automated tests pass, the Scrum Master will merge the pull-request into develop, resolving any merge conflicts that may occur.
1. Develop is merged into master at the end of each sprint. Master should NOT be modified otherwise, unless there is an urgent need.
