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
        /*
        [HttpPost]
        public async Task<ActionResult<UserDto>> Post()
        {

            HttpResponseMessage httpResponse = await http.PostAsync("http://127.0.0.1:3000/users");
            var users = JsonSerializer.Deserialize<List<UserDto>>(await httpResponse.Content.ReadAsStringAsync());

            UserDto user1=new UserDto();
            user1.FirstName = "pera";
            user1.LastName = "perci";
            user1.Username = "pera";
            user1.Password = "sifra123";
            /*UserDto user2=new UserDto();
            user2.FirstName = "mika";
            user2.LastName = "mikic";
            user2.Username = "mika";
            user2.Password = "sifra123";
            return user1;
            
    }
*/

    }
}
