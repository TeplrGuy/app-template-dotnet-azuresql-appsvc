# 🎤 Demo Script: Azure Load Testing & GitHub Copilot
## AI-Powered Chaos Engineering & Resilience Validation

**Duration:** 30-45 minutes  
**Audience:** DevOps Engineers, SREs, Platform Engineers  

---

## 🎬 Pre-Demo Checklist

- [ ] Azure resources deployed and running
- [ ] GitHub Copilot extension installed in VS Code
- [ ] Repository cloned and open in VS Code
- [ ] Azure Portal open with App Insights dashboard
- [ ] Terminal ready

---

## Act 1: Set the Stage (5 min)

### 🎯 The Problem

> "Your application handles 10,000 users during normal hours. But what happens when Black Friday traffic hits? What if the database becomes slow? What if a region goes down?"

**Show Application:**
```
https://your-contoso-app.azurewebsites.net/Students
```

Browse through:
- Student list
- Course catalog
- Create student form

**Key Point:** "The app works great now. But we need to validate it handles stress."

---

## Act 2: AI-Powered Load Test Creation (10 min)

### 🤖 Understanding Skills vs Prompts

**Quick Explanation to Audience:**

| Type | What It Is | When to Use |
|------|------------|-------------|
| **Skills** | Auto-activated knowledge bases | Copilot uses them automatically when relevant |
| **Prompts** | Specific task templates | You invoke them for defined tasks |

> "Skills teach Copilot HOW to do something. Prompts tell Copilot to DO a specific task."

### 🧪 Use the Load Test Prompt

1. **Open Copilot Chat** (`Ctrl+Shift+I`)

2. **Use the prompt:**
   ```
   /generate-load-test
   
   Create a load test for the student enrollment API that:
   - Simulates 100 concurrent users
   - Tests GET /Students and POST /Students/Create
   - Runs for 5 minutes with 1 minute ramp-up
   ```

3. **Show what gets generated:**
   - `loadtests/scenarios/student-enrollment.jmx` - JMeter test plan
   - `loadtests/scenarios/student-enrollment-config.yaml` - Azure config
   - Updated `loadtests/manifest.yaml` - Auto-discovery entry

4. **Highlight the Azure Load Testing MCP integration:**
   ```
   The skill uses Azure MCP tools to interact directly with Azure Load Testing:
   - mcp__azure__loadtesting_create_test
   - mcp__azure__loadtesting_create_run
   - mcp__azure__loadtesting_get_run
   ```

**Key Point:** "The prompt creates files. The skill provides the knowledge. MCP tools execute against Azure."

---

## Act 3: Running Azure Load Testing (10 min)

### 🚀 Execute Load Test

**Option A: Via Portal**
1. Navigate to Azure Load Testing resource
2. Create new test
3. Upload JMeter file
4. Configure environment variables
5. Run test

**Option B: Via CLI**
```bash
az load test run \
  --name contoso-load-test \
  --resource-group rg-contoso \
  --load-test-resource alt-contoso
```

**Option C: Via GitHub Actions**
```bash
gh workflow run build-test-deploy.yml \
  --ref main \
  -f run_load_test=true
```

### 📊 Show Results

- Response time distribution
- Throughput graph
- Error rate
- Pass/fail criteria

**Key Point:** "The load test is now a quality gate. If p95 > 2 seconds, deployment stops."

---

## Act 4: Chaos Engineering with AI (10 min)

### 🔥 Design Chaos Experiment with Prompt

1. **Use the chaos experiment prompt:**
   ```
   /design-chaos-experiment
   
   Scenario: Black Friday sale with database becoming slow
   Hypothesis: App should degrade gracefully (2x response time, <5% errors)
   Target: Azure SQL Database
   ```

2. **Review what gets generated:**
   - `infra/chaos/experiments/sql-latency-blackfriday.bicep` - Experiment definition
   - Hypothesis documentation
   - Abort conditions
   - Companion load test reference

3. **Show how the chaos-engineering skill auto-activated:**
   > "Notice Copilot automatically used the chaos-engineering skill. It knows about:
   > - Blast radius control
   > - Steady state definitions  
   > - Azure Chaos Studio fault library"

4. **Deploy experiment:**
   ```bash
   az deployment group create \
     --template-file infra/chaos/experiments/sql-latency-blackfriday.bicep \
     --parameters targetResourceId="/subscriptions/.../databases/contosodb"
   ```

### 🎯 Run Experiment During Load

1. Start load test (background)
2. Wait for baseline (1 min)
3. Start chaos experiment
4. **Switch to Azure Monitor dashboard**

### 📊 Observe Impact

- Response time spike (expected: ~2x baseline)
- Error rate (should stay <5%)
- Circuit breaker activation (if implemented)

**Key Point:** "The skill knew to include abort conditions - safety is built into the design."

---

## Act 5: Closed Loop Remediation (5-10 min)

### 🤖 AI Finds and Fixes the Issue

1. **Simulate alert received:**
   ```
   Alert: High response time detected
   p95 latency: 2400ms (threshold: 2000ms)
   Error: SqlException - Connection timeout
   ```

2. **Use the remediation prompt:**
   ```
   /analyze-and-fix-error
   
   Error: SqlException: Connection Timeout Expired
   Stack trace: at ContosoUniversity.Data.SchoolContext...
   Frequency: Intermittent (during chaos experiment)
   Environment: Staging
   ```

3. **Show what the remediation-expert skill provides:**
   - Root cause analysis
   - Code fix with Polly retry logic
   - Unit test that reproduces the issue
   - Integration test that verifies the fix

4. **Review the generated fix:**
   ```csharp
   // Before: No retry logic
   await _context.Students.ToListAsync();
   
   // After: With EF Core retry
   services.AddDbContext<SchoolContext>(options =>
       options.UseSqlServer(connectionString, sqlOptions =>
           sqlOptions.EnableRetryOnFailure(
               maxRetryCount: 5,
               maxRetryDelay: TimeSpan.FromSeconds(30),
               errorNumbersToAdd: null)));
   ```

5. **Pipeline triggers:**
   - Build → Test → Load Test → Chaos Test
   - Verify fix works under the same chaos conditions

**Key Point:** "The skill automatically includes regression tests. We'll never have this issue unreported again."

---

## Closing (3 min)

### 🎯 Skills vs Prompts Recap

| Component | Purpose | Example |
|-----------|---------|---------|
| **Skills** | Knowledge that auto-activates | `chaos-engineering` skill knows about blast radius, FMEA, abort conditions |
| **Prompts** | Specific task with outputs | `/generate-load-test` creates JMX + config + manifest entry |
| **MCP Tools** | Direct Azure integration | `mcp__azure__loadtesting_create_run` executes tests |

### 📊 What We Demonstrated

| Capability | Tool | Type |
|------------|------|------|
| Generate test scenarios | `/generate-load-test` prompt | Task template |
| Design chaos experiments | `/design-chaos-experiment` prompt | Task template |
| Performance validation | Azure Load Testing + MCP | Azure service |
| Resilience testing | Azure Chaos Studio | Azure service |
| Error analysis & fixes | `/analyze-and-fix-error` prompt | Task template |
| Auto-activated knowledge | Skills (`chaos-engineering`, etc.) | Knowledge base |

### 📚 Resources

- [Agent Skills Specification](https://agentskills.io/specification)
- [Azure Load Testing MCP](https://learn.microsoft.com/azure/developer/azure-mcp-server/tools/azure-load-testing)
- [Azure Load Testing Docs](https://learn.microsoft.com/azure/load-testing/)
- [Azure Chaos Studio Docs](https://learn.microsoft.com/azure/chaos-studio/)

### ❓ Q&A

---

## 🔧 Backup Commands

If something goes wrong:

```bash
# Cancel chaos experiment
az chaos experiment cancel --name sql-latency-experiment --resource-group rg-contoso

# Check app health
curl -I https://your-contoso-app.azurewebsites.net/health

# Restart app service
az webapp restart --name contoso-app --resource-group rg-contoso

# Check pipeline status
gh run list --workflow build-test-deploy.yml
```
