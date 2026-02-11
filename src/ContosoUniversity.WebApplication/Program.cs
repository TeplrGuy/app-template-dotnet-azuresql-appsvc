using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using System;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<CookiePolicyOptions>(options =>
{
    options.CheckConsentNeeded = context => true;
    options.MinimumSameSitePolicy = SameSiteMode.None;
});

if (builder.Configuration["URLAPI"] != null)
{
    builder.Services.AddHttpClient("client", client => { client.BaseAddress = new Uri(builder.Configuration["URLAPI"]); });
}
else
{
    var section = builder.Configuration.GetSection("Api");
    builder.Services.AddHttpClient("client", client => { client.BaseAddress = new Uri(section["Address"]); });
}

builder.Services.AddRazorPages();

// Add health checks
builder.Services.AddHealthChecks();

if (builder.Configuration["APPLICATIONINSIGHTS_CONNECTION_STRING"] != null)
{
    builder.Services.AddApplicationInsightsTelemetry(builder.Configuration["APPLICATIONINSIGHTS_CONNECTION_STRING"]);
}
else
{
    builder.Services.AddApplicationInsightsTelemetry();
}

var app = builder.Build();

app.UseExceptionHandler("/Error");
app.UseHsts();

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseAuthorization();

// Map health check endpoint
app.MapHealthChecks("/health");

// Explicit root mapping to avoid 404s at GET /
app.MapGet("/", () => Results.Redirect("/Index"));

// Modern endpoint routing for Razor Pages
app.MapRazorPages();

app.Run();
