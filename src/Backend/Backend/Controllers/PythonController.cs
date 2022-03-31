using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text;
using Backend.Models;
using Aspose.Cells;
using Aspose.Cells.Utility;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PythonController : ControllerBase
    {
        private readonly HttpClient http = new HttpClient();
        public static string? Username { get; set; } //username trenutno prijavljenog korisnika
        public static string? Name { get; set; } //ime ucitanog csv fajla

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
            var csv = JsonSerializer.Deserialize<JsonDocument>(await httpResponse.Content.ReadAsStringAsync()); //json forma
            //var data = await httpResponse.Content.ReadAsStringAsync(); //forma stringa
            return Ok(csv);
        }

        [HttpGet("kor")] //Primanje kor_mat iz pajtona 
        public async Task<ActionResult<JsonDocument>> GetKor()
        {
            HttpResponseMessage httpResponse = await http.GetAsync("http://127.0.0.1:3000/kor");
            var kor = JsonSerializer.Deserialize<JsonDocument>(await httpResponse.Content.ReadAsStringAsync()); //json forma
            //var data = await httpResponse.Content.ReadAsStringAsync(); //forma stringa
            return Ok(kor);
        }


        [HttpGet("model")] //Primanje Modela iz pajtona 
        public async Task<ActionResult<JsonDocument>> GetModel()
        {
            HttpResponseMessage httpResponse = await http.GetAsync("http://127.0.0.1:3000/model");
            var model = JsonSerializer.Deserialize<JsonDocument>(await httpResponse.Content.ReadAsStringAsync()); //json forma
            var data = await httpResponse.Content.ReadAsStringAsync(); //forma stringa

            var workbook = new Workbook();
            var worksheet = workbook.Worksheets[0];
            var layoutOptions = new JsonLayoutOptions();
            layoutOptions.ArrayAsTable = true;
            JsonUtility.ImportData(data, worksheet.Cells, 0, 0, layoutOptions);

            string path = Directory.GetCurrentDirectory() + @"\Users\" + Username;
            var upgradedName = Name.Substring(0, Name.Length-4);
            string modelName = upgradedName + "Model.csv";
            string pathToCreate = System.IO.Path.Combine(path, modelName); // treba da stoji NameMODEL.csv
            /*
            if (System.IO.File.Exists(pathToCreate))
            {
                return BadRequest("Ucitani fajl je vec u bazi.");
            }*/
           // if (!System.IO.Directory.Exists(path))
            //{
             //   return BadRequest("Niste registrovani/ulogovani." + path);
            //}
           // else
                workbook.Save(pathToCreate, SaveFormat.CSV);


            return Ok(model);
        }
    }
}
