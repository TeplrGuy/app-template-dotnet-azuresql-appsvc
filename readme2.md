# Contoso University - Quick Start Guide

## Overview
Contoso University is a .NET 6 MVC web application demonstrating modern cloud-native development with Azure services, performance testing, and chaos engineering capabilities.

## Tech Stack
- **.NET 6** - MVC Web Application
- **Azure App Service** - Hosting
- **Azure SQL Database** - Data storage
- **Azure Load Testing** - Performance validation
- **Azure Chaos Studio** - Resilience testing
- **Application Insights** - Monitoring
- **GitHub Actions** - CI/CD

## Quick Start

### Prerequisites
- .NET 6 SDK
- Azure CLI
- Azure subscription

### Local Development
```bash
# Clone the repository
git clone https://github.com/TeplrGuy/app-template-dotnet-azuresql-appsvc.git
cd app-template-dotnet-azuresql-appsvc

# Build and run
dotnet build src/ContosoUniversity.sln
dotnet run --project src/ContosoUniversity.WebApplication
```

### Deploy to Azure
```bash
# Login to Azure
az login

# Deploy using Azure Developer CLI
azd up
```

## Key Features

### 🧪 Performance Testing
- Automated load testing in CI/CD pipeline
- Pass/fail criteria enforced before production deployment
- JMeter-based test scripts in `/loadtests`

### 🔥 Chaos Engineering
- Azure Chaos Studio integration
- Pre-configured fault injection experiments
- Database latency and CPU pressure scenarios

### 🤖 AI-Powered Development
- GitHub Copilot skills for resilience engineering
- Reusable prompts for generating tests
- Automated error analysis and remediation

### 📊 Observability
- Application Insights integration
- Azure Monitor dashboards
- Custom alerts for SLO violations

## Project Structure
```
├── src/                           # Application source code
│   ├── ContosoUniversity.WebApplication/
│   ├── ContosoUniversity.API/
│   └── ContosoUniversity.Test/
├── infra/                         # Infrastructure as Code (Bicep)
│   ├── chaos/                     # Chaos experiments
│   └── monitoring/                # Dashboards & alerts
├── loadtests/                     # Load testing scripts
├── .github/
│   ├── workflows/                 # CI/CD pipelines
│   ├── skills/                    # GitHub Copilot skills
│   └── prompts/                   # Reusable Copilot prompts
└── scripts/                       # Utility scripts
```

## Testing

### Unit Tests
```bash
dotnet test src/ContosoUniversity.Test/ContosoUniversity.Test.csproj
```

### Load Tests
```bash
# Run locally with JMeter
jmeter -n -t loadtests/contoso-load-test.jmx
```

## Deployment Pipeline
1. **Build** - Compile and run unit tests
2. **Deploy to Staging** - Deploy to staging environment
3. **Load Test** - Run performance tests with pass/fail criteria
4. **Deploy to Production** - Deploy only if tests pass
5. **Health Check** - Verify application health

## Documentation
- [README.md](README.md) - Comprehensive deployment guide
- [DEMO-README.md](DEMO-README.md) - Enhanced feature documentation
- [DEMO-SCRIPT.md](DEMO-SCRIPT.md) - Demo walkthrough
- [AGENTS.md](AGENTS.md) - AI agent documentation

## Resources
- [Azure Load Testing](https://learn.microsoft.com/azure/load-testing/)
- [Azure Chaos Studio](https://learn.microsoft.com/azure/chaos-studio/)
- [GitHub Copilot](https://docs.github.com/copilot)
- [Azure Developer CLI](https://learn.microsoft.com/azure/developer/azure-developer-cli/)

## License
This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.
