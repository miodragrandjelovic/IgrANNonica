using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PythonController : ControllerBase
    {
        private readonly HttpClient http = new HttpClient();

        [HttpGet]
        public async Task<ActionResult<UserDto>> Get()
        {
            HttpResponseMessage httpResponse = await http.GetAsync("http://127.0.0.1:3000/users");
            var users = JsonSerializer.Deserialize<List<UserDto>>(await httpResponse.Content.ReadAsStringAsync());

            return Ok(users);
        }
    }
}
