// ============================================================================
// Azure Chaos Studio - SQL Database Latency Experiment
// ============================================================================
// This experiment injects network latency into the Azure SQL Database 
// connection to test application resilience to slow database responses.
//
// Prerequisites:
// - Chaos Studio extension installed on target resources
// - Managed Identity with appropriate permissions
// ============================================================================

@description('The name of the chaos experiment')
param experimentName string = 'sql-latency-experiment'

@description('Location for the chaos experiment')
param location string = resourceGroup().location

@description('Resource ID of the target Azure SQL Database')
param sqlDatabaseResourceId string

@description('Resource ID of the App Service to test')
param appServiceResourceId string

@description('Duration of the latency injection in ISO 8601 format')
param duration string = 'PT3M'

@description('Latency to inject in milliseconds')
param latencyMs int = 500

@description('Tags for resources')
param tags object = {
  purpose: 'chaos-engineering'
  application: 'contoso-university'
}

// ============================================================================
// Chaos Experiment
// ============================================================================
resource chaosExperiment 'Microsoft.Chaos/experiments@2023-11-01' = {
  name: experimentName
  location: location
  tags: tags
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    selectors: [
      {
        type: 'List'
        id: 'selector-sql'
        targets: [
          {
            type: 'ChaosTarget'
            id: '${sqlDatabaseResourceId}/providers/Microsoft.Chaos/targets/Microsoft-AzureSQLDatabase'
          }
        ]
      }
      {
        type: 'List'
        id: 'selector-appservice'
        targets: [
          {
            type: 'ChaosTarget'
            id: '${appServiceResourceId}/providers/Microsoft.Chaos/targets/Microsoft-AppService'
          }
        ]
      }
    ]
    steps: [
      {
        name: 'Step 1 - Inject SQL Latency'
        branches: [
          {
            name: 'Branch 1 - Database Fault'
            actions: [
              {
                type: 'continuous'
                name: 'urn:csci:microsoft:azureSqlDatabase:networkLatency/1.0'
                selectorId: 'selector-sql'
                duration: duration
                parameters: [
                  {
                    key: 'delayMs'
                    value: string(latencyMs)
                  }
                  {
                    key: 'direction'
                    value: 'both'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}

// ============================================================================
// Role Assignments for Chaos Experiment
// ============================================================================
// The experiment needs Contributor permissions to inject faults
// Requires the deploying identity to have Owner or User Access Administrator role

resource sqlRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(chaosExperiment.id, sqlDatabaseResourceId, 'sql-chaos')
  scope: resourceGroup()
  properties: {
    roleDefinitionId: subscriptionResourceId(
      'Microsoft.Authorization/roleDefinitions',
      'b24988ac-6180-42a0-ab88-20f7382dd24c'
    ) // Contributor
    principalId: chaosExperiment.identity.principalId
    principalType: 'ServicePrincipal'
  }
}

// ============================================================================
// Outputs
// ============================================================================
output experimentId string = chaosExperiment.id
output experimentName string = chaosExperiment.name
output principalId string = chaosExperiment.identity.principalId
