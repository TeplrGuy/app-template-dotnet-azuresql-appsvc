param name string
param location string = resourceGroup().location
param tags object = {}

param kind string = ''
param reserved bool = false
param sku object

resource windowsAppServicePlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: name
  location: location
  tags: tags
  sku: sku
  kind: kind
  properties: {
    reserved: reserved
  }
}

output id string = windowsAppServicePlan.id
