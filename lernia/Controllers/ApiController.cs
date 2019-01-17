using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace lernia.Controllers
{
    [Route("api")]
    public class ApiController : Controller
    {
        const string SEARCH_KEY = "";
        const string DEPARTURE_KEY = "";

        [Route("search/{term}")]
        public async Task Search([FromRoute] string term) 
        {
            await Query($"https://api.resrobot.se/v2/location.name?key=" + SEARCH_KEY + "&input=" + term + "&format=json");
        }

        [Route("departures/{siteID}")]
        public async Task Departures([FromRoute] string siteID) 
        {
            await Query($"https://api.resrobot.se/v2/departureBoard?key=" + DEPARTURE_KEY + "&id=" + siteID + "&format=json");
        }

        private async Task Query(string url)
        {
            using (var request = new HttpClient())
            {
                var stream = await request.GetStreamAsync(url);
                Response.ContentType = "application/json";
                await stream.CopyToAsync(Response.Body);
            }
        }
    }
}