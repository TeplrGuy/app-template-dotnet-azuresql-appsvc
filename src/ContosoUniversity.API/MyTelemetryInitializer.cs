using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.Extensibility;
using System;

public class MyTelemetryInitializer : ITelemetryInitializer
{
    public void Initialize(ITelemetry telemetry)
    {
        string? computerName = Environment.GetEnvironmentVariable("COMPUTERNAME");
        if (string.IsNullOrEmpty(computerName))
        {
            return;
        }
        telemetry.Context.Cloud.RoleInstance = computerName;
    }
}


