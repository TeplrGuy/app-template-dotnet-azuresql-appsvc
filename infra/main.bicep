// =============================================================================
// Contoso University - Main Infrastructure Template
// =============================================================================
// This template deploys all required Azure resources:
// - App Service Plan
// - Web App (MVC frontend)
// - API App (Web API backend)
// - SQL Server with Database
// - Application Insights
// - Log Analytics Workspace
// - Azure Load Testing resource
// =============================================================================

targetScope = 'subscription'

@minLength(1)
@maxLength(20)
@description('Name of the environment (used as prefix for all resources)')
param environmentName string

@description('Primary location for all resources')
param location string

@description('Name of the web application')
param webServiceName string = '${environmentName}-app'

@description('Name of the API application')
param apiServiceName string = '${environmentName}-api'

@secure()
@description('SQL Server administrator password')
param sqlAdminPassword string

@secure()
@description('SQL application user password')
param appUserPassword string = sqlAdminPassword

// Resource group
resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'rg-${environmentName}'
  location: location
  tags: {
    environment: environmentName
    project: 'ContosoUniversity'
  }
}

// Deploy all resources into the resource group
module resources 'resources.bicep' = {
  name: 'resources-${environmentName}'
  scope: rg
  params: {
    environmentName: environmentName
    location: location
    webServiceName: webServiceName
    apiServiceName: apiServiceName
    sqlAdminPassword: sqlAdminPassword
    appUserPassword: appUserPassword
  }
}

// Outputs
output AZURE_RESOURCE_GROUP string = rg.name
output AZURE_WEBAPP_NAME string = resources.outputs.webAppName
output AZURE_API_NAME string = resources.outputs.apiAppName
output AZURE_SQL_SERVER string = resources.outputs.sqlServerName
output AZURE_SQL_DATABASE string = resources.outputs.sqlDatabaseName
output AZURE_APPINSIGHTS_NAME string = resources.outputs.appInsightsName
output AZURE_LOAD_TESTING_NAME string = resources.outputs.loadTestingName
output WEB_URI string = resources.outputs.webUri
output API_URI string = resources.outputs.apiUri
