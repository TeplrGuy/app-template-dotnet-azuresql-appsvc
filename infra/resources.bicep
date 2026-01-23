// =============================================================================
// Contoso University - Resource Definitions
// =============================================================================
// All Azure resources for the application
// =============================================================================

param environmentName string
param location string
param webServiceName string
param apiServiceName string

@secure()
param sqlAdminPassword string
@secure()
param appUserPassword string

// Tags for all resources
var tags = {
  environment: environmentName
  project: 'ContosoUniversity'
  'azd-env-name': environmentName
}

// Naming conventions
var sqlServerName = 'sql-${environmentName}'
var sqlDatabaseName = 'sqldb-${environmentName}'
var appServicePlanName = 'plan-${environmentName}'
var appInsightsName = 'appi-${environmentName}'
var logAnalyticsName = 'log-${environmentName}'
var loadTestingName = 'lt-${environmentName}'

// =============================================================================
// Log Analytics Workspace
// =============================================================================
resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: logAnalyticsName
  location: location
  tags: tags
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
  }
}

// =============================================================================
// Application Insights
// =============================================================================
resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  tags: tags
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalytics.id
    IngestionMode: 'LogAnalytics'
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

// =============================================================================
// App Service Plan
// =============================================================================
resource appServicePlan 'Microsoft.Web/serverfarms@2022-09-01' = {
  name: appServicePlanName
  location: location
  tags: tags
  sku: {
    name: 'S1'
    tier: 'Standard'
    capacity: 1
  }
  properties: {
    reserved: false // Windows
  }
}

// =============================================================================
// Web App (MVC Frontend)
// =============================================================================
resource webApp 'Microsoft.Web/sites@2022-09-01' = {
  name: webServiceName
  location: location
  tags: union(tags, { 'azd-service-name': 'web' })
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      netFrameworkVersion: 'v6.0'
      alwaysOn: true
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      appSettings: [
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: appInsights.properties.ConnectionString
        }
        {
          name: 'ApplicationInsightsAgent_EXTENSION_VERSION'
          value: '~3'
        }
      ]
    }
  }

  // Staging slot for zero-downtime deployments
  resource stagingSlot 'slots' = {
    name: 'staging'
    location: location
    tags: tags
    properties: {
      serverFarmId: appServicePlan.id
    }
  }
}

// =============================================================================
// API App (Web API Backend)
// =============================================================================
resource apiApp 'Microsoft.Web/sites@2022-09-01' = {
  name: apiServiceName
  location: location
  tags: union(tags, { 'azd-service-name': 'api' })
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      netFrameworkVersion: 'v6.0'
      alwaysOn: true
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      appSettings: [
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: appInsights.properties.ConnectionString
        }
        {
          name: 'ApplicationInsightsAgent_EXTENSION_VERSION'
          value: '~3'
        }
      ]
    }
  }
}

// =============================================================================
// SQL Server
// =============================================================================
resource sqlServer 'Microsoft.Sql/servers@2022-05-01-preview' = {
  name: sqlServerName
  location: location
  tags: tags
  properties: {
    version: '12.0'
    minimalTlsVersion: '1.2'
    publicNetworkAccess: 'Enabled'
    administratorLogin: 'sqladmin'
    administratorLoginPassword: sqlAdminPassword
  }

  // Allow Azure services
  resource firewallAzure 'firewallRules' = {
    name: 'AllowAzureServices'
    properties: {
      startIpAddress: '0.0.0.0'
      endIpAddress: '0.0.0.0'
    }
  }
}

// =============================================================================
// SQL Database
// =============================================================================
resource sqlDatabase 'Microsoft.Sql/servers/databases@2022-05-01-preview' = {
  parent: sqlServer
  name: sqlDatabaseName
  location: location
  tags: tags
  sku: {
    name: 'S0'
    tier: 'Standard'
  }
  properties: {
    collation: 'SQL_Latin1_General_CP1_CI_AS'
    maxSizeBytes: 2147483648 // 2GB
  }
}

// =============================================================================
// Azure Load Testing
// =============================================================================
resource loadTesting 'Microsoft.LoadTestService/loadTests@2022-12-01' = {
  name: loadTestingName
  location: location
  tags: tags
  properties: {}
}

// =============================================================================
// Connection String Configuration
// =============================================================================
// Build connection string for apps (using appUserPassword for app connections)
// Note: In production, you would create a separate SQL user with limited permissions
var sqlConnectionString = 'Server=tcp:${sqlServer.properties.fullyQualifiedDomainName},1433;Initial Catalog=${sqlDatabaseName};Persist Security Info=False;User ID=sqladmin;Password=${appUserPassword};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;'

// Configure Web App connection string
resource webAppConnectionStrings 'Microsoft.Web/sites/config@2022-09-01' = {
  parent: webApp
  name: 'connectionstrings'
  properties: {
    ContosoUniversityAPIContext: {
      value: sqlConnectionString
      type: 'SQLAzure'
    }
  }
}

// Configure API App connection string
resource apiAppConnectionStrings 'Microsoft.Web/sites/config@2022-09-01' = {
  parent: apiApp
  name: 'connectionstrings'
  properties: {
    ContosoUniversityAPIContext: {
      value: sqlConnectionString
      type: 'SQLAzure'
    }
  }
}

// =============================================================================
// Outputs
// =============================================================================
output webAppName string = webApp.name
output apiAppName string = apiApp.name
output sqlServerName string = sqlServer.name
output sqlDatabaseName string = sqlDatabase.name
output appInsightsName string = appInsights.name
output loadTestingName string = loadTesting.name
output webUri string = 'https://${webApp.properties.defaultHostName}'
output apiUri string = 'https://${apiApp.properties.defaultHostName}'
output appInsightsConnectionString string = appInsights.properties.ConnectionString
output sqlServerFqdn string = sqlServer.properties.fullyQualifiedDomainName
