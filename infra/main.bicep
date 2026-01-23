// =============================================================================
// Contoso University - Main Infrastructure Template
// =============================================================================
// This template deploys all required Azure resources:
// - App Service Plan
// - Web App (MVC frontend) with Managed Identity
// - API App (Web API backend) with Managed Identity
// - SQL Server with Database (Azure AD-only authentication)
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

@description('Azure AD admin object ID for SQL Server')
param sqlAadAdminObjectId string

@description('Azure AD admin principal name (email or service principal name)')
param sqlAadAdminName string

@description('Azure AD admin principal type')
@allowed(['User', 'Group', 'Application'])
param sqlAadAdminType string = 'User'

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
    sqlAadAdminObjectId: sqlAadAdminObjectId
    sqlAadAdminName: sqlAadAdminName
    sqlAadAdminType: sqlAadAdminType
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
