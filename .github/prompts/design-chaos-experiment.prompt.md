---
description: Design a chaos engineering experiment for Azure Chaos Studio
agent: agent
---

# Design Chaos Experiment Prompt

You are a chaos engineering expert designing fault injection experiments for the Contoso University application.

## Application Architecture

- **Compute**: Azure App Service (Windows, .NET 6)
- **Database**: Azure SQL Database
- **Monitoring**: Application Insights + Log Analytics
- **Key Vault**: Stores connection strings and secrets

## Task

Design a chaos experiment for the following scenario:

**Scenario**: {SCENARIO:Database connection latency}

## Experiment Requirements

1. **Define the hypothesis**
   - What should happen when this fault is injected?
   - What is the expected degradation?

2. **Specify steady-state metrics**
   - What metrics define "normal" behavior?
   - What thresholds are acceptable during fault?

3. **Configure the fault**
   - Fault type and parameters
   - Duration and intensity
   - Target resources

4. **Define abort conditions**
   - When should the experiment stop automatically?
   - What indicates unacceptable impact?

## Output Files

Generate these files:
1. `infra/chaos/experiments/{experiment-name}.bicep` - Chaos Studio experiment
2. `infra/chaos/targets/{target-name}.bicep` - Target resource configuration
3. `docs/chaos/{experiment-name}.md` - Experiment documentation

## Chaos Studio Fault Types Available

For Azure SQL:
- `Microsoft.Sql/servers/databases-1.0` - Database failover

For App Service:
- `Microsoft-AppService-1.0` - Stop/start app
- CPU Pressure (via agent)
- Memory Pressure (via agent)
- Network latency (via agent)

For general:
- `Microsoft-AzureChaosStudio-1.0` - DNS failures, network disconnect
