using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PythonController : ControllerBase
    {
        private readonly HttpClient http = new HttpClient();

        [HttpGet("hp")] //Primanje HP iz pajtona 
        public async Task<ActionResult<Hiperparametri>> GetHp()
        {
            HttpResponseMessage httpResponse = await http.GetAsync("http://127.0.0.1:3000/hp");
            var hp = JsonSerializer.Deserialize<List<Hiperparametri>>(await httpResponse.Content.ReadAsStringAsync());
            return Ok(hp);
        }

        [HttpGet("csv")] //Primanje CSV iz pajtona 
        public async Task<ActionResult<JsonDocument>> GetCsv()
        {
            HttpResponseMessage httpResponse = await http.GetAsync("http://127.0.0.1:3000/csv");
            var data = JsonSerializer.Deserialize<JsonDocument>(await httpResponse.Content.ReadAsStringAsync()); //json forma
            //var data = await httpResponse.Content.ReadAsStringAsync(); //forma stringa
            return Ok(data);
        }


        [HttpPost] //Slanje HP na pajton
        public async Task<IActionResult> Post(Hiperparametri hiper)
        {
            var hiperjson = JsonSerializer.Serialize(hiper);
            var data = new StringContent(hiperjson, System.Text.Encoding.UTF8, "application/json");
            var url = "http://127.0.0.1:3000/hp";
            var response = await http.PostAsync(url, data);
            //var studenti = JsonSerializer.Deserialize<UserDto>(await response.Content.ReadAsStringAsync());
            return Ok(hiper);
        }

    }
}
