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


        [HttpGet("stats")] //Primanje statistickih parametara iz pajtona 
        public async Task<ActionResult<JsonDocument>> GetStat()
        {
            HttpResponseMessage httpResponse = await http.GetAsync("http://127.0.0.1:3000/stats");
            var stat = JsonSerializer.Deserialize<JsonDocument>(await httpResponse.Content.ReadAsStringAsync());
            return Ok(stat);
        }

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

        [HttpGet("kor")] //Primanje kor_mat iz pajtona 
        public async Task<ActionResult<JsonDocument>> GetKor()
        {
            HttpResponseMessage httpResponse = await http.GetAsync("http://127.0.0.1:3000/kor");
            var data = JsonSerializer.Deserialize<JsonDocument>(await httpResponse.Content.ReadAsStringAsync()); //json forma
            //var data = await httpResponse.Content.ReadAsStringAsync(); //forma stringa
            return Ok(data);
        }
    }
}
