// ============================================================================
// Azure Chaos Studio - App Service CPU Pressure Experiment
// ============================================================================
// This experiment injects CPU stress into the Azure App Service to test
// application behavior under resource constraints and validate autoscaling.
//
// Prerequisites:
// - Chaos Studio extension installed on target App Service
// - Managed Identity with appropriate permissions
// ============================================================================

@description('The name of the chaos experiment')
param experimentName string = 'cpu-pressure-experiment'

@description('Location for the chaos experiment')
param location string = resourceGroup().location

@description('Resource ID of the target App Service')
param appServiceResourceId string

@description('Duration of the CPU pressure in ISO 8601 format')
param duration string = 'PT5M'

@description('CPU pressure percentage (0-100)')
@minValue(10)
@maxValue(95)
param cpuPressurePercentage int = 80

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
        name: 'Step 1 - Apply CPU Pressure'
        branches: [
          {
            name: 'Branch 1 - CPU Stress'
            actions: [
              {
                type: 'continuous'
                name: 'urn:csci:microsoft:appService:cpuPressure/1.0'
                selectorId: 'selector-appservice'
                duration: duration
                parameters: [
                  {
                    key: 'pressureLevel'
                    value: string(cpuPressurePercentage)
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
// Role Assignment
// ============================================================================
resource appServiceRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(chaosExperiment.id, appServiceResourceId, 'appservice-chaos')
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
