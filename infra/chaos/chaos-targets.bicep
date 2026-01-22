// ============================================================================
// Azure Chaos Studio - Chaos Targets Setup
// ============================================================================
// This module enables Chaos Studio targets on Azure resources to allow
// fault injection experiments.
//
// Run this BEFORE creating experiments to ensure targets are registered.
// ============================================================================

@description('Resource ID of the Azure SQL Database')
param sqlDatabaseResourceId string

@description('Resource ID of the App Service')
param appServiceResourceId string

@description('Tags for resources')
param tags object = {
  purpose: 'chaos-engineering'
  application: 'contoso-university'
}

// ============================================================================
// Extract resource names from resource IDs
// ============================================================================
var sqlServerName = split(sqlDatabaseResourceId, '/')[8]
var sqlDatabaseName = split(sqlDatabaseResourceId, '/')[10]
var appServiceName = split(appServiceResourceId, '/')[8]

// ============================================================================
// Enable Chaos Target on SQL Database
// ============================================================================
resource sqlChaosTarget 'Microsoft.Chaos/targets@2023-11-01' = {
  name: 'Microsoft-AzureSQLDatabase'
  scope: resourceGroup()
  properties: {}
}

// ============================================================================
// Enable Capabilities on SQL Database Target
// ============================================================================
resource sqlLatencyCapability 'Microsoft.Chaos/targets/capabilities@2023-11-01' = {
  parent: sqlChaosTarget
  name: 'NetworkLatency-1.0'
}

resource sqlDisconnectCapability 'Microsoft.Chaos/targets/capabilities@2023-11-01' = {
  parent: sqlChaosTarget
  name: 'NetworkDisconnect-1.0'
}

// ============================================================================
// Enable Chaos Target on App Service
// ============================================================================
resource appServiceChaosTarget 'Microsoft.Chaos/targets@2023-11-01' = {
  name: 'Microsoft-AppService'
  scope: resourceGroup()
  properties: {}
}

// ============================================================================
// Enable Capabilities on App Service Target
// ============================================================================
resource cpuPressureCapability 'Microsoft.Chaos/targets/capabilities@2023-11-01' = {
  parent: appServiceChaosTarget
  name: 'CpuPressure-1.0'
}

resource memoryPressureCapability 'Microsoft.Chaos/targets/capabilities@2023-11-01' = {
  parent: appServiceChaosTarget
  name: 'MemoryPressure-1.0'
}

// ============================================================================
// Outputs
// ============================================================================
output sqlChaosTargetId string = sqlChaosTarget.id
output appServiceChaosTargetId string = appServiceChaosTarget.id
