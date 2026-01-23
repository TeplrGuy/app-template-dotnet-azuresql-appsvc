# 🤖 Azure SRE Agent Integration Setup

## Overview

The Azure SRE Agent is now **deployed automatically** as part of the infrastructure. This guide covers post-deployment configuration for the **closed-loop remediation demo** (Act 4 in SESSION-PLAN.md).

The integration enables:
1. **Automatic issue creation** when Azure Monitor detects problems
2. **Root cause analysis** with codebase context
3. **Automated PR creation** with fixes (using Copilot Coding Agent)
4. **Pipeline validation** of the fix

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Azure Monitor  │───▶│   SRE Agent     │───▶│  GitHub Issue   │
│  Detects Issue  │    │  Analyzes &     │    │  + PR Created   │
└─────────────────┘    │  Diagnoses      │    └────────┬────────┘
                       └─────────────────┘             │
                                                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Deploy &       │◀───│  CI/CD Runs     │◀───│  Human Approves │
│  Verify         │    │  Validates Fix  │    │  PR             │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## What's Deployed Automatically

The infrastructure (via `infra/main.bicep`) deploys:

| Resource | Name | Purpose |
|----------|------|---------|
| SRE Agent | `sre-{environment}` | AI-powered incident response |
| App Insights Connector | Auto-connected | Telemetry analysis |
| Log Analytics Connector | Auto-connected | Log analysis |
| RBAC Assignments | Reader roles | Access to monitored resources |

### Deployment Parameters

```bash
# Enable/disable SRE Agent (default: enabled)
az deployment sub create \
  --template-file infra/main.bicep \
  --parameters enableSreAgent=true \
               sreAgentMode='Review' \
               githubRepoUrl='https://github.com/TeplrGuy/app-template-dotnet-azuresql-appsvc'
```

**Agent Modes:**
- `Review` - Human approval required for all actions (recommended for demo)
- `Autonomous` - Auto-remediate with notifications
- `ReadOnly` - Observe and report only

---

## Post-Deployment Setup (One-Time)

### Step 1: Connect GitHub Repository

In the Azure Portal:
1. Navigate to your SRE Agent resource (`sre-{environment}`)
2. Go to **Resource Mapping** tab
3. Click **Connect Repository**
4. Enter: `https://github.com/TeplrGuy/app-template-dotnet-azuresql-appsvc`
5. Complete OAuth authorization

This grants SRE Agent:
- ✅ Read access to code for analysis
- ✅ Create issues for incidents
- ✅ Create PRs for remediation (with approval)

---

## Step 2: Configure Alert Rules

Create Azure Monitor alerts that trigger SRE Agent (use your environment name):

### High Response Time Alert
```bash
ENVIRONMENT="contoso-prod"
RESOURCE_GROUP="rg-${ENVIRONMENT}"

az monitor metrics alert create \
  --name "High-Response-Time" \
  --resource-group $RESOURCE_GROUP \
  --scopes "/subscriptions/{sub}/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.Web/sites/${ENVIRONMENT}-api" \
  --condition "avg requests/duration > 2000" \
  --window-size 5m \
  --evaluation-frequency 1m \
  --action-groups sre-agent-action-group
```

### Database Timeout Alert
```bash
az monitor metrics alert create \
  --name "Database-Timeout" \
  --resource-group $RESOURCE_GROUP \
  --scopes "/subscriptions/{sub}/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.Insights/components/appi-${ENVIRONMENT}" \
  --condition "count exceptions/count where customDimensions.ExceptionType contains 'SqlException' > 5" \
  --window-size 5m \
  --action-groups sre-agent-action-group
```

---

## Step 3: Configure Action Group for SRE Agent

```bash
# Create action group that notifies SRE Agent
az monitor action-group create \
  --name sre-agent-action-group \
  --resource-group $RESOURCE_GROUP \
  --short-name SREAgent \
  --action webhook sre-agent-webhook \
    "https://management.azure.com/subscriptions/{sub}/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.App/agents/sre-${ENVIRONMENT}/incidents?api-version=2025-05-01-preview"
```

---

## Step 4: GitHub Labels for SRE Agent Issues

Create these labels in your repository:

| Label | Color | Description |
|-------|-------|-------------|
| `sre-agent` | `#ff6600` | Issues created by Azure SRE Agent |
| `automated-fix` | `#00ff00` | PRs with automated fixes |
| `needs-review` | `#ffff00` | Requires human approval |
| `resilience` | `#0066ff` | Resilience/performance issues |

```bash
gh label create sre-agent --color ff6600 --description "Issues created by Azure SRE Agent"
gh label create automated-fix --color 00ff00 --description "PRs with automated fixes"
gh label create needs-review --color ffff00 --description "Requires human approval"
gh label create resilience --color 0066ff --description "Resilience/performance issues"
```

---

## Step 7: Test the Integration

### Trigger a Test Incident

1. **Start a chaos experiment:**
   ```bash
   az chaos experiment start \
     --name sql-latency-experiment \
     --resource-group rg-contoso-prod
   ```

2. **Run load test to generate traffic:**
   ```bash
   gh workflow run load-test.yml -f test_id=chaos-resilience
   ```

3. **Wait for alert to fire** (watch Azure Portal)

4. **Check GitHub Issues** for SRE Agent created issue

5. **Review the automated analysis** and suggested fix

---

## Demo Flow (Act 4)

### What to Show

1. **Trigger the Problem**
   - Start chaos experiment (SQL latency)
   - Show load test running
   - Watch response times spike in App Insights

2. **SRE Agent Detects**
   - Show alert firing in Azure Monitor
   - Navigate to SRE Agent → Incidents
   - Show root cause analysis with code context

3. **Automated Issue + PR**
   - Open GitHub Issues → find SRE Agent issue
   - Show detailed diagnosis
   - Open linked PR with suggested fix

4. **Human Approval**
   - Review the PR changes
   - Approve and merge
   - Watch pipeline run

5. **Verification**
   - Show new load test validating fix
   - Demonstrate improved response times

### Demo Script Commands

```powershell
# Terminal 1: Start chaos
az chaos experiment start --name sql-latency-experiment --resource-group rg-contoso-prod

# Terminal 2: Watch issues
gh issue list --label sre-agent --state open --json number,title,createdAt | ConvertFrom-Json

# Terminal 3: Monitor pipeline
gh run watch
```

---

## Troubleshooting

### SRE Agent Not Creating Issues

1. Check OAuth connection: SRE Agent → Settings → Connections
2. Verify repository URL is correct
3. Check SRE Agent has write permissions to issues

### Alerts Not Triggering

1. Verify action group is linked to SRE Agent
2. Check alert rule evaluation frequency
3. Test with manual metric spike

### PRs Not Being Created

1. Ensure Copilot Coding Agent is enabled
2. Check SRE Agent has PR creation permissions
3. Verify branch protection allows bot PRs

---

## Resources

- [Azure SRE Agent Documentation](https://learn.microsoft.com/azure/sre-agent/)
- [Connect Code Repository](https://learn.microsoft.com/azure/sre-agent/code-repository-connect)
- [Create and Use Agents](https://learn.microsoft.com/azure/sre-agent/usage)
- [GitHub Copilot Coding Agent](https://docs.github.com/copilot/using-github-copilot/using-copilot-coding-agent)
