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

### 🤖 Use GitHub Copilot to Generate Load Test

1. **Open Copilot Chat** (`Ctrl+Shift+I`)

2. **Use the prompt:**
   ```
   @workspace /generate-load-test
   ```

3. **Show the generated JMeter XML:**
   - Thread groups
   - User scenarios (browse, search, create)
   - Assertions and timers

4. **Explain the config:**
   ```yaml
   failureCriteria:
     - avg(response_time_ms) > 1000
     - percentage(error) > 1
   ```

**Key Point:** "Copilot understands our application structure and creates realistic test scenarios."

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

### 🔥 Design Chaos Experiment

1. **Open Copilot Chat:**
   ```
   @workspace /design-chaos-experiment
   
   Scenario: Black Friday sale with database becoming slow
   ```

2. **Review generated Bicep:**
   - SQL latency injection
   - 500ms additional delay
   - 3-minute duration

3. **Deploy experiment:**
   ```bash
   az deployment group create \
     --template-file infra/chaos/experiments/sql-latency.bicep \
     --parameters sqlDatabaseResourceId="..."
   ```

### 🎯 Run Experiment During Load

1. Start load test (background)
2. Wait for baseline (1 min)
3. Start chaos experiment
4. **Switch to Azure Monitor dashboard**

### 📊 Observe Impact

- Response time spike
- Possible error increase
- CPU/memory changes

**Key Point:** "We see the database latency causes ~3x response time increase, but the app stays up."

---

## Act 5: Closed Loop Remediation (5-10 min)

### 🤖 AI Finds the Issue

1. **Simulate alert received:**
   ```
   Alert: High response time detected
   p95 latency: 2400ms (threshold: 2000ms)
   ```

2. **Use Copilot:**
   ```
   @workspace /analyze-and-fix-error
   
   Error: Database query timeout exceptions
   Application Insights trace attached
   ```

3. **Review AI suggestions:**
   - Add connection timeout settings
   - Implement retry with exponential backoff
   - Add circuit breaker pattern

4. **Apply fix** (show code change)

5. **Pipeline triggers:**
   - Build → Test → Deploy → Load Test
   - Verify fix works

**Key Point:** "AI + automation creates a self-healing development loop."

---

## Closing (3 min)

### 🎯 What We Demonstrated

| Capability | Tool |
|------------|------|
| Generate test scenarios | GitHub Copilot |
| Performance validation | Azure Load Testing |
| Resilience testing | Azure Chaos Studio |
| Observability | Azure Monitor |
| Automated remediation | GitHub Actions + AI |

### 📚 Resources

- [Azure Load Testing Docs](https://learn.microsoft.com/azure/load-testing/)
- [Azure Chaos Studio Docs](https://learn.microsoft.com/azure/chaos-studio/)
- [GitHub Copilot Skills](https://docs.github.com/copilot)

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
