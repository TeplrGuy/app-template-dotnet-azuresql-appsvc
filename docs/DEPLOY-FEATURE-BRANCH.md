# Quick Start: Deploy Feature Branch to Staging/QA

## You Can Now Deploy from This Branch! 🎉

The deployment workflow has been updated to allow manual deployments to Staging and QA environments from **any branch**, including feature branches like this one.

## How to Deploy This Branch

### Deploy to Staging

1. Go to: https://github.com/TeplrGuy/app-template-dotnet-azuresql-appsvc/actions/workflows/resilience-pipeline.yml
2. Click **Run workflow** (top right)
3. Select:
   - **Use workflow from:** `copilot/refactor-contoso-app-react-frontend` (or your current branch)
   - **Target environment:** `staging`
   - **Component to deploy:** `all`
4. Click **Run workflow**
5. Wait for build to complete
6. Approve deployment if required (based on Environment settings)

### Deploy to QA

Same steps as above, but select **`qa`** for the environment.

### Deploy to Production

Production deployments are **restricted to the `main` branch only** for security. You must merge your PR first.

## What Gets Deployed

When you trigger a manual deployment from this branch:

- ✅ **React Frontend** - Your current code from `src/contoso-frontend/`
- ✅ **Node.js API** - Your current code from `src/contoso-api-node/`
- ✅ **.NET API** - Your current code from `src/ContosoUniversity.API/` (if selected)

## Environment Strategy

| Environment | Branch Allowed | Approval | Purpose |
|-------------|---------------|----------|---------|
| Staging | **Any** | Optional | Test feature branches |
| QA | **Any** | Required | Validate feature branches |
| Production | **Main only** | Required | Production release |

## Workflow Conditions

The workflow uses these conditions:

```yaml
# Staging: Automatic from main, or manual from any branch
deploy-staging:
  if: |
    (github.event_name == 'push' && github.ref == 'refs/heads/main') || 
    (github.event_name == 'workflow_dispatch' && github.event.inputs.environment == 'staging')

# QA: Manual from any branch
deploy-qa:
  if: github.event_name == 'workflow_dispatch' && github.event.inputs.environment == 'qa'

# Production: Manual from main branch ONLY
deploy-production:
  if: |
    github.event_name == 'workflow_dispatch' && 
    github.event.inputs.environment == 'production' &&
    github.ref == 'refs/heads/main'
```

## Testing Your Changes

After deploying to Staging or QA:

1. Wait for deployment to complete
2. Check the deployment summary in the workflow run
3. Visit the deployed application (URLs in Azure portal)
4. Test your new features
5. Document results in PR comments

## Rollback

To rollback a feature branch deployment:

1. Re-run the workflow with `main` branch selected
2. Choose the same environment
3. This will redeploy the main branch code

## Need Help?

See [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) for complete documentation.
