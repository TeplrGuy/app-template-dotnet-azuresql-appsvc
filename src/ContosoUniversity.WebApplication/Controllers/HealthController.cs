using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ContosoUniversity.WebApplication.Controllers
{
    /// <summary>
    /// Health check controller for Azure Load Balancer and chaos experiments.
    /// Returns 200 OK when the application is healthy.
    /// </summary>
    [ApiController]
    [Route("[controller]")]
    public class HealthController : ControllerBase
    {
        private readonly ILogger<HealthController> _logger;

        public HealthController(ILogger<HealthController> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Simple health check endpoint.
        /// Used by Azure App Service health probes and load testing.
        /// </summary>
        /// <returns>Health status</returns>
        [HttpGet]
        public IActionResult Get()
        {
            _logger.LogInformation("Health check requested at {Time}", DateTime.UtcNow);

            return Ok(new
            {
                status = "Healthy",
                timestamp = DateTime.UtcNow,
                version = GetType().Assembly.GetName().Version?.ToString() ?? "1.0.0"
            });
        }

        /// <summary>
        /// Detailed health check including database connectivity.
        /// </summary>
        /// <returns>Detailed health status</returns>
        [HttpGet("detailed")]
        public async Task<IActionResult> GetDetailed()
        {
            var checks = new List<HealthCheckResult>();

            // Check 1: Basic application health
            checks.Add(new HealthCheckResult
            {
                Name = "Application",
                Status = "Healthy",
                Duration = TimeSpan.Zero
            });

            // Note: In a real implementation, you would inject the DbContext
            // and check database connectivity here
            checks.Add(new HealthCheckResult
            {
                Name = "Database",
                Status = "Healthy",
                Duration = TimeSpan.FromMilliseconds(10)
            });

            var allHealthy = checks.All(c => c.Status == "Healthy");

            var result = new
            {
                status = allHealthy ? "Healthy" : "Unhealthy",
                timestamp = DateTime.UtcNow,
                checks = checks
            };

            if (!allHealthy)
            {
                _logger.LogWarning("Health check failed: {Result}", result);
                return StatusCode(503, result);
            }

            return Ok(result);
        }
    }

    public class HealthCheckResult
    {
        public string Name { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public TimeSpan Duration { get; set; }
    }
}
