# Deployment Guide - Manual Approval Workflow

## Overview

The Contoso University deployment pipeline has been refactored to require **manual approval** for QA and Production deployments, while Staging deployments happen automatically on push to `main`.

## Deployment Strategy

| Environment | Trigger | Branch Restriction | Approval Required | Purpose |
|-------------|---------|-------------------|-------------------|---------|
| **Staging** | Push to `main` OR workflow_dispatch | Any branch for manual | ❌ No | Default target for all merged PRs, testing feature branches |
| **QA** | workflow_dispatch | Any branch | ✅ Yes | Testing and validation from any branch |
| **Production** | workflow_dispatch | Main branch only | ✅ Yes | Production release (security: main only) |

### Workflow Behavior

```mermaid
graph TD
    A[Push to main] --> B[Build & Test]
    B --> C[Deploy to Staging]
    C --> D[Load Test Staging]
    D --> E{Manual Approval?}
    E -->|No| F[End - Staging Deployed]
    E -->|Yes - workflow_dispatch| G{Which Environment?}
    G -->|QA| H[Approve QA Deployment]
    G -->|Production| I[Approve Production Deployment]
    H --> J[Deploy to QA]
    I --> K[Deploy to Production]
```

## How to Deploy

### Automatic Deployment to Staging

**When:** Every push to `main` branch

1. Developer merges PR to `main`
2. CI pipeline runs automatically
3. Code is built and tested
4. **Deployment to Staging happens automatically**
5. Load tests run on Staging
6. ✅ Complete - Code is now in Staging

**No manual action required!**

### Manual Deployment to Staging (from any branch)

**When:** You want to test a feature branch in Staging environment

1. Go to **Actions** tab in GitHub
2. Select **🚀 Deployment Pipeline - React Frontend & Node.js API**
3. Click **Run workflow**
4. Select:
   - Branch: **Your feature branch** (e.g., `copilot/refactor-contoso-app-react-frontend`)
   - Environment: `staging`
   - Deploy component: `all` (or specific component)
5. Click **Run workflow**
6. **Wait for approval if required** (depends on GitHub Environment settings)
7. Deployment proceeds to Staging

**Note:** This allows testing feature branches in Staging before merging to main.

### Manual Deployment to QA (from any branch)

**When:** You want to test a feature branch in QA environment

1. Go to **Actions** tab in GitHub
2. Select **🚀 Deployment Pipeline - React Frontend & Node.js API**
3. Click **Run workflow**
4. Select:
   - Branch: **Your feature branch** (e.g., `copilot/refactor-contoso-app-react-frontend`)
   - Environment: `qa`
   - Deploy component: `all` (or specific component)
5. Click **Run workflow**
6. **Wait for approval notification**
7. Approver reviews and approves
8. Deployment proceeds to QA

**Note:** You can test feature branches in QA before merging to main!

### Manual Deployment to Production (main branch only)

**When:** You want to promote main branch to Production

**Prerequisites:**
- Code must be on the **main branch** (feature branches cannot deploy to production)
- All required approvals must be obtained

**Steps:**

1. Go to **Actions** tab in GitHub
2. Select **🚀 Deployment Pipeline - React Frontend & Node.js API**
3. Click **Run workflow**
4. Select:
   - Branch: **`main`** (required for production)
   - Environment: `production`
   - Deploy component: `all`
5. Click **Run workflow**
6. **Wait for approval notification**
7. Approver reviews and approves
8. Deployment proceeds to Production via slot swap
9. Health checks validate Production
10. Automatic rollback on failure

## GitHub Environment Configuration

To enable manual approvals, configure GitHub Environments:

### Setting Up QA Environment Protection

1. Go to **Settings** → **Environments**
2. Click **New environment** (or edit existing `qa`)
3. Add **Required reviewers**:
   - Add team members who can approve QA deployments
   - Recommend: QA lead, team lead
4. **Wait timer**: 0 minutes (optional: add delay if needed)
5. **Deployment branches**: Leave blank to allow any branch (recommended for QA/Staging)
6. Save protection rules

**Note:** QA and Staging can be deployed from any branch to enable feature branch testing before merging to main.

### Setting Up Staging Environment Protection

1. Go to **Settings** → **Environments**
2. Click **New environment** (or edit existing `staging`)
3. Optional: Add **Required reviewers** if you want manual approval for staging
   - Leave empty for automatic deployment on push to main
4. **Deployment branches**: Leave blank to allow any branch for workflow_dispatch
5. Save protection rules

### Setting Up Production Environment Protection

1. Go to **Settings** → **Environments**
2. Click **New environment** (or edit existing `production`)
3. Add **Required reviewers**:
   - Add senior team members who can approve Production
   - Recommend: Tech lead, product owner, SRE on-call
4. **Wait timer**: 0 minutes (optional: add delay for change freeze windows)
5. **Deployment branches**: **Limit to `main` only** (security requirement)
6. Save protection rules

**Important:** Production deployments are restricted to the main branch for security. Only QA and Staging allow feature branch deployments.

### Staging Environment

- **No strict protection rules** - allows automatic deployment from main
- **For manual deployments:** Can be triggered from any branch via workflow_dispatch
- Staging is the proving ground for both main branch and feature branches

## Feature Branch Testing

**New Capability:** You can now deploy feature branches to Staging and QA environments for testing before merging to main!

### Benefits
- ✅ Test your changes in a real environment before merging
- ✅ Validate integrations with Azure services
- ✅ Run validation on feature branches
- ✅ Get early feedback from QA team

### How to Deploy a Feature Branch

1. Push your feature branch to GitHub
2. Go to **Actions** → **Deployment Pipeline - React Frontend & Node.js API**
3. Click **Run workflow**
4. Select your **feature branch** from the dropdown (e.g., `copilot/refactor-contoso-app-react-frontend`)
5. Choose environment: `staging` or `qa`
6. Approve if required (based on Environment protection rules)
7. Test your feature in the deployed environment

### Best Practices
- Deploy to **Staging** first for initial validation
- Deploy to **QA** only after staging tests pass
- Clean up: Re-deploy main branch to environments after feature testing
- Document test results in PR comments

### Important Restrictions
- ✅ **Staging & QA**: Can deploy from any branch
- ❌ **Production**: Can ONLY deploy from `main` branch (security)

## Approval Workflow

### For Approvers

When a deployment requires your approval:

1. You'll receive a **notification email**
2. Go to the GitHub Actions run page
3. Review the changes:
   - **Check which branch is being deployed** (feature or main)
   - Review test results
   - Verify staging is healthy (if deploying to prod)
4. Click **Review deployments**
5. Select environment to approve
6. Add comment (optional but recommended - especially note the branch)
7. Click **Approve and deploy**

### For Requesters

Best practices when requesting approval:

- **Clearly identify the branch** being deployed (feature vs main)
- Include context in the workflow run description
- Ensure all tests pass before requesting approval
- Have rollback plan ready
- Notify approvers via Slack/Teams
- Document any breaking changes

## Rollback Procedures

### Staging Rollback

```bash
# Option 1: Revert commit and push to main
git revert <commit-hash>
git push origin main

# Option 2: Re-run previous successful deployment
# Go to Actions → Find last good run → Re-run workflow
```

### QA Rollback

```bash
# Use workflow_dispatch to deploy previous version
# Actions → Run workflow → qa → (previous commit)
```

### Production Rollback

Production uses **slot swaps**, enabling instant rollback:

```bash
# Manual rollback via Azure Portal
az webapp deployment slot swap \
  --name $AZURE_WEBAPP_NAME \
  --resource-group $AZURE_RESOURCE_GROUP \
  --slot staging \
  --target-slot production
```

Or use the pipeline's **automatic rollback** on health check failure.

## Deployment Checklist

### Before Deploying to Staging (Automatic)
- ✅ All PR tests passed
- ✅ Code reviewed and approved
- ✅ No merge conflicts

### Before Requesting QA Approval
- ✅ Staging deployment successful
- ✅ Manual smoke test on Staging passed
- ✅ QA team notified
- ✅ Test data prepared in QA

### Before Requesting Production Approval
- ✅ Staging load tests passed
- ✅ Chaos tests passed (if applicable)
- ✅ No critical bugs in Staging
- ✅ Change advisory board approval (if required)
- ✅ Rollback plan documented
- ✅ On-call engineer aware
- ✅ Customer communication sent (if applicable)

## Environment Variables and Secrets

Each environment uses different secrets:

### Staging
- `AZURE_WEBAPP_NAME` (staging instance)
- `AZURE_SQL_CONNECTION_STRING` (staging DB)
- Lower-tier resources

### QA
- `AZURE_WEBAPP_NAME` (QA instance)
- `AZURE_SQL_CONNECTION_STRING` (QA DB)
- Test data, not production secrets

### Production
- `AZURE_WEBAPP_NAME` (production instance)
- `AZURE_SQL_CONNECTION_STRING` (production DB)
- **Never use production secrets in lower environments!**

## Monitoring and Alerts

### Staging
- Application Insights enabled
- Alerts on deployment failures
- Load test results visible

### QA
- Limited monitoring
- Manual validation primary

### Production
- Full Application Insights
- PagerDuty/Azure Monitor alerts
- Synthetic monitoring
- Automatic rollback on health check failure

## Troubleshooting

### Approval Not Showing Up

**Symptom:** Workflow runs but no approval prompt appears

**Solution:**
1. Check GitHub Environment protection rules are configured
2. Verify you're listed as a required reviewer
3. Ensure workflow uses correct `environment:` name

### Deployment Stuck "Waiting"

**Symptom:** Deployment waiting for approval indefinitely

**Solution:**
1. Check notification emails for approval request
2. Go to Actions → Click the run → Review deployments
3. If urgent, approvers can force approve

### Production Deployment Failed

**Symptom:** Production deployment fails after approval

**Solution:**
1. Check health check logs
2. Automatic rollback should trigger
3. If rollback fails, manual swap back to staging
4. Check Application Insights for errors
5. Run synthetic tests manually

## Best Practices

1. **Test in Staging first** - Always validate in staging before QA/Prod
2. **Small, frequent deployments** - Easier to rollback and debug
3. **Off-hours production deployments** - Minimize user impact
4. **Communication** - Notify stakeholders before production changes
5. **Monitor after deployment** - Watch metrics for 30+ minutes
6. **Document incidents** - Learn from deployment failures

## Questions?

Contact the SRE team or DevOps lead for:
- Approval access requests
- Environment configuration help
- Deployment troubleshooting
- Process improvements
