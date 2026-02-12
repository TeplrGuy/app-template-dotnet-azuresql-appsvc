## Purpose
<!-- Describe the intention of the changes being proposed. What problem does it solve or functionality does it add? -->
* ...

## Does this introduce a breaking change?
<!-- Mark one with an "x". -->
```
[ ] Yes
[ ] No
```

## Pull Request Type
What kind of change does this Pull Request introduce?

<!-- Please check the one that applies to this PR using "x". -->
```
[ ] Bugfix
[ ] Feature
[ ] Code style update (formatting, local variables)
[ ] Refactoring (no functional changes, no api changes)
[ ] Documentation content changes
[ ] Other... Please describe:
```

## Security Checklist
**All PRs must complete this checklist:**
```
[ ] No secrets or credentials are committed to the repository
[ ] All dependencies are from trusted sources (npm registry, NuGet.org)
[ ] Input validation is implemented for all user inputs
[ ] SQL queries use parameterized queries (no string concatenation)
[ ] API endpoints have proper authentication/authorization (if applicable)
[ ] Sensitive data is not logged or exposed in error messages
[ ] No use of eval(), dangerouslySetInnerHTML, or similar unsafe patterns
```

## Testing Checklist
```
[ ] Unit tests added/updated for new functionality
[ ] All existing tests pass locally
[ ] Integration tests added (if applicable)
[ ] Load tests updated (if performance-critical changes)
[ ] Manual testing performed
```

## Code Quality Checklist
```
[ ] Code follows existing style conventions
[ ] TypeScript/C# type definitions are correct and complete
[ ] ESLint/Prettier passes for JS/TS code
[ ] dotnet format passes for C# code (or verified formatting)
[ ] No console.log() or debugging code left in production code
[ ] Error handling is comprehensive and user-friendly
```

## Performance Considerations
<!-- If this PR affects performance, describe the impact -->
```
[ ] Database queries are optimized (indexes, no N+1 queries)
[ ] API response times are acceptable (< 2s for typical requests)
[ ] Frontend bundle size is not significantly increased
[ ] Caching is used where appropriate
[ ] Not applicable - no performance impact
```

## Package Dependencies
**If adding new npm or NuGet packages:**
```
[ ] Packages are from trusted sources
[ ] Package versions are pinned (not using latest or *)
[ ] No known security vulnerabilities in dependencies
[ ] Licenses are compatible with project requirements
[ ] Package size impact is acceptable
```

## Deployment Considerations
```
[ ] Environment variables documented in .env.example
[ ] Database migrations are backward compatible (if applicable)
[ ] No breaking changes to existing APIs
[ ] Feature flags used for experimental features (if applicable)
[ ] Rollback plan documented (if high-risk change)
```

## How to Test
*  Get the code

```bash
git clone [repo-address]
cd [repo-name]
git checkout [branch-name]

# For .NET changes
dotnet restore src/ContosoUniversity.sln
dotnet build src/ContosoUniversity.sln
dotnet test src/ContosoUniversity.Test/ContosoUniversity.Test.csproj

# For Frontend changes
cd src/contoso-frontend
npm install
npm run build
npm test

# For Node API changes
cd src/contoso-api-node
npm install
npm run build
npm test
```

* Test the code
<!-- Add steps to run the tests suite and/or manually test -->
```
```

## What to Check
Verify that the following are valid
* ...

## Documentation
```
[ ] README files updated (if adding new features or changing setup)
[ ] API documentation updated (if changing endpoints)
[ ] Comments added for complex logic
[ ] Architecture diagrams updated (if applicable)
```

## Related Issues
<!-- Link any related issues here using #issue-number -->
Fixes #
Relates to #

## Screenshots / Videos
<!-- If this changes UI, add screenshots or videos demonstrating the changes -->

## Other Information
<!-- Add any other helpful information that may be needed here. -->
