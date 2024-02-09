using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace ContosoUniversity.WebApplication.Pages.Departments
{
    public class IndexModel : PageModel
    {
        private readonly IHttpClientFactory client; 
        private static readonly HttpClient httpClient = new HttpClient(); 
        string URLAPI = Environment.GetEnvironmentVariable("URLAPI");
       

        public IndexModel(IHttpClientFactory client)
        {
            this.client = client;
        }

        public Models.APIViewModels.DepartmentResult Department { get; set; }

        public async Task OnGetAsync()
        {
            // Generate a random delay value between 1000 and 10000 milliseconds
            Random random = new Random();
            int delay = random.Next(1000, 10001); // Generates a random integer between 1000 (inclusive) and 10001 (exclusive)

            var request = HttpWebRequest.Create(URLAPI + "/api/Departments");
            var response = await request.GetResponseAsync();
            using (var streamReader = new StreamReader(response.GetResponseStream()))
            {
                var responseContent = await streamReader.ReadToEndAsync();
                Department = JsonConvert.DeserializeObject<Models.APIViewModels.DepartmentResult>(responseContent);
            }

            // Use the generated delay value in the URL
            var causeDelay = HttpWebRequest.Create($"https://app.requestly.io/delay/{delay}/https://app.requestly.io/echo");
            causeDelay.GetResponse();
        }


       
    }
}