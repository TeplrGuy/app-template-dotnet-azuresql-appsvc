param name string
param location string = resourceGroup().location
param tags object = {}

param appCommandLine string = ''
param applicationInsightsName string = ''
param windowsAppServicePlanId string
param appSettings object = {}
param keyVaultName string
param serviceName string = 'api'

module api '../core/host/windowsappservice.bicep' = {
  name: '${name}-app-module'
  params: {
    windowsFxVersion:''
    name: name
    location: location
    tags: union(tags, { 'azd-service-name': serviceName })
    allowAllOrigins: true
    appCommandLine: appCommandLine
    applicationInsightsName: applicationInsightsName
    windowsAppServicePlanId: windowsAppServicePlanId
    appSettings: appSettings
    keyVaultName: keyVaultName
    runtimeName: ''
    runtimeVersion: ''
    scmDoBuildDuringDeployment: false
  }
}

output SERVICE_API_IDENTITY_PRINCIPAL_ID string = api.outputs.identityPrincipalId
output SERVICE_API_NAME string = api.outputs.name
output SERVICE_API_URI string = api.outputs.uri
