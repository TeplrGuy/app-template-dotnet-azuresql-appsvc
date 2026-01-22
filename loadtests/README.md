# 📊 Azure Load Testing for Contoso University

This folder contains load testing configurations for the Contoso University application using Azure Load Testing.

## 📁 Files

| File | Description |
|------|-------------|
| `contoso-load-test.jmx` | JMeter test plan with user scenarios |
| `config.yaml` | Azure Load Testing configuration |

## 🎯 Test Scenarios

The load test simulates three types of users:

### 1. Browse Users (70% of traffic)
- View home page
- Browse student list
- View course catalog

### 2. Search Users (20% of traffic)
- Search for students by name
- Filter course listings

### 3. Create Users (10% of traffic)
- Access student creation form
- Submit new student records

## 📈 Pass/Fail Criteria

| Metric | Threshold | Priority |
|--------|-----------|----------|
| Average Response Time | < 1000ms | Critical |
| p95 Response Time | < 2000ms | Critical |
| p99 Response Time | < 4000ms | Warning |
| Error Rate | < 1% | Critical |

## 🚀 Running Locally

### Prerequisites
- [Apache JMeter 5.5+](https://jmeter.apache.org/download_jmeter.cgi)
- Java 11 or higher

### Run Test
```bash
# Run in GUI mode (for development)
jmeter -t contoso-load-test.jmx

# Run in CLI mode (for CI/CD)
jmeter -n -t contoso-load-test.jmx \
  -Jwebapp_url=https://your-app.azurewebsites.net \
  -Jconcurrent_users=50 \
  -Jduration_seconds=120 \
  -l results.jtl
```

## ☁️ Running in Azure Load Testing

### Via Azure Portal
1. Go to Azure Load Testing resource
2. Click "Create Test"
3. Upload `contoso-load-test.jmx`
4. Configure parameters in "Parameters" tab
5. Set pass/fail criteria in "Test criteria" tab
6. Run test

### Via GitHub Actions
The test runs automatically on every push to `main` branch via the CI/CD pipeline.

```yaml
- name: Run Azure Load Test
  uses: azure/load-testing@v1
  with:
    loadTestConfigFile: 'loadtests/config.yaml'
    loadTestResource: ${{ secrets.AZURE_LOAD_TEST_RESOURCE }}
    resourceGroup: ${{ secrets.AZURE_RESOURCE_GROUP }}
```

### Via Azure CLI
```bash
az load test create \
  --name "contoso-load-test" \
  --resource-group "rg-contoso" \
  --load-test-resource "alt-contoso" \
  --test-plan "contoso-load-test.jmx" \
  --engine-instances 1

az load test run \
  --name "contoso-load-test" \
  --resource-group "rg-contoso" \
  --load-test-resource "alt-contoso"
```

## 📊 Interpreting Results

### Key Metrics to Watch

1. **Response Time Distribution**
   - Look for p50, p90, p95, p99 values
   - Identify outliers that may indicate issues

2. **Throughput**
   - Requests per second
   - Should scale linearly with users

3. **Error Rate**
   - Any errors indicate problems
   - Check error messages for root cause

4. **Server Metrics** (from App Insights)
   - CPU utilization
   - Memory consumption
   - Database query times

### Common Issues

| Symptom | Possible Cause | Solution |
|---------|---------------|----------|
| High p99 latency | Database slow queries | Add indexes, optimize queries |
| Increasing error rate | Connection pool exhaustion | Increase pool size, add retry logic |
| Flat throughput | CPU bottleneck | Scale up or out |
| Memory growth | Memory leak | Profile application |

## 🔗 Integration with Chaos Testing

After load tests pass, chaos experiments can run to validate resilience under load:

1. Start load test (background)
2. Inject fault (e.g., database latency)
3. Observe degradation metrics
4. Verify graceful degradation
5. Stop chaos experiment
6. Verify recovery

See `/infra/chaos/` for chaos experiment definitions.

# Contoso University Load Testing

Enterprise-grade load testing strategy for Contoso University using Azure Load Testing.

## Testing Strategy by Environment

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│     DEV     │───▶│     QA      │───▶│   STAGING   │───▶│    PROD     │
│             │    │             │    │             │    │             │
│ Smoke Test  │    │ Load Test   │    │ Load Test   │    │ Monitoring  │
│ (10 users)  │    │ (100 users) │    │ (100 users) │    │ Only        │
│ 2 min       │    │ 5 min       │    │ 5 min       │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                              │
                                              ▼
                                      ┌─────────────┐
                                      │    PERF     │
                                      │ Environment │
                                      │             │
                                      │ Stress Test │
                                      │ Chaos Test  │
                                      │ (500 users) │
                                      └─────────────┘
```

## Test Profiles

| Profile | Users | Duration | When to Run | Purpose |
|---------|-------|----------|-------------|---------|
| **Smoke** | 10 | 2 min | Every PR | Quick sanity check |
| **Load** | 100 | 5 min | QA/Staging deploy | SLA validation |
| **Stress** | 500 | 10 min | Pre-release (manual) | Find breaking points |

## Files Structure

```
loadtests/
├── config.yaml              # Base Azure Load Testing config
├── contoso-load-test.jmx    # JMeter test plan
├── profiles/
│   ├── smoke.yaml           # Smoke test parameters
│   ├── load.yaml            # Standard load test parameters
│   └── stress.yaml          # Stress test parameters
└── README.md
```

## Pass/Fail Criteria

### Smoke Test (Dev/PR)
- ✅ Avg response time < 3000ms
- ✅ Error rate < 5%

### Load Test (QA/Staging)
- ✅ Avg response time < 2000ms
- ✅ p95 response time < 3000ms
- ✅ Error rate < 1%

### Stress Test (Perf)
- ✅ Avg response time < 5000ms
- ✅ Error rate < 10%
- ✅ No cascading failures

## Running Tests

### Via GitHub Actions (Recommended)

```bash
# Smoke test runs automatically on PRs
# Load test runs automatically on merge to main

# Manual trigger for stress test
gh workflow run load-test.yml \
  -f environment=perf \
  -f test_profile=stress
```

### Via Azure CLI

```bash
# Set environment variables
export WEBAPP_URL="your-app.azurewebsites.net"
export CONCURRENT_USERS="100"
export DURATION_SECONDS="300"
export RAMP_UP_SECONDS="60"

# Run the test
az load test-run create \
  --load-test-resource <your-alt-resource> \
  --resource-group <your-rg> \
  --test-id contoso-university-load-test \
  --env webapp_url=$WEBAPP_URL \
  --env concurrent_users=$CONCURRENT_USERS \
  --env duration_seconds=$DURATION_SECONDS \
  --env ramp_up_seconds=$RAMP_UP_SECONDS
```

### Locally with JMeter

```bash
# Install JMeter 5.5+
# Run smoke test locally
jmeter -n -t contoso-load-test.jmx \
  -Jwebapp_url=localhost:5000 \
  -Jconcurrent_users=5 \
  -Jduration_seconds=60 \
  -Jramp_up_seconds=10 \
  -l results.jtl
```

## Best Practices Implemented

1. **Shift-Left Testing** - Smoke tests run on every PR
2. **Environment-Specific Loads** - Different profiles per stage
3. **Automated Gates** - Builds fail if SLAs breached
4. **Dedicated Perf Environment** - Destructive tests isolated
5. **Baseline Comparison** - Track performance over time
6. **Auto-Stop** - Save costs if tests fail badly

## Required GitHub Configuration

### Repository Variables
- `AZURE_LOAD_TEST_RESOURCE` - Name of Azure Load Testing resource
- `AZURE_RESOURCE_GROUP` - Resource group name
- `DEV_APP_URL` - Dev environment URL
- `QA_APP_URL` - QA environment URL  
- `PERF_APP_URL` - Performance environment URL

### Environment Secrets (per environment)
- `AZURE_CLIENT_ID` - Service principal client ID
- `AZURE_TENANT_ID` - Azure AD tenant ID
- `AZURE_SUBSCRIPTION_ID` - Azure subscription ID

### GitHub Environments
Create these environments with appropriate protection rules:
- `dev` - No approvals required
- `qa` - No approvals required
- `perf` - **Require manual approval** (for stress tests)
