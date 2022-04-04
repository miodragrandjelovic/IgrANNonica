using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text;
using Backend.Models;
using Aspose.Cells;
using Aspose.Cells.Utility;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PythonController : ControllerBase
    {
        private readonly HttpClient http = new HttpClient();
        public static string? Username { get; set; } //username trenutno prijavljenog korisnika
        public static string? Name { get; set; } //ime ucitanog csv fajla
        public static Loaded? fajl { get; set; }

        private readonly IConfiguration _configuration;
        private readonly UserDbContext _context;
        public PythonController(UserDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }


        [HttpGet("preloadCsv")] //Vracanje ucitanog csv fajla iz baze.
        public async Task<ActionResult<IEnumerable<Realestate>>> GetPreloadCsv()
        {
            var loadedCsv = await _context.Realestate.ToListAsync(); //lista/json
            string jsoncsv = JsonSerializer.Serialize(loadedCsv); //string
            

            return Ok(loadedCsv);
        }


        [HttpGet("preloadStat")] 
        public async Task<ActionResult<JsonDocument>> GetPreloadStat()
        {
            //Loaded? fajl1;
            var loadedCsv = await _context.Realestate.ToListAsync();
            var csve = JsonSerializer.Serialize(loadedCsv); //string
            var jsoncsva = JsonSerializer.Deserialize<JsonDocument>(csve); //json
            

            var data = new StringContent(csve, System.Text.Encoding.UTF8, "application/json");
            var url = "http://127.0.0.1:3000/csv";
            var response = await http.PostAsync(url, data);

            HttpResponseMessage httpResponse = await http.GetAsync("http://127.0.0.1:3000/stats");
            var stat = JsonSerializer.Deserialize<JsonDocument>(await httpResponse.Content.ReadAsStringAsync());
            //var data = await httpResponse.Content.ReadAsStringAsync();

            //fajl.Csv = jsoncsva;
            //fajl.Stats = stat;
            return Ok(stat);
        }

        [HttpGet("preloadKor")]
        public async Task<ActionResult<JsonDocument>> GetPreloadKor()
        {
            var loadedCsv = await _context.Realestate.ToListAsync();
            var csve = JsonSerializer.Serialize(loadedCsv); //string
            var jsoncsva = JsonSerializer.Deserialize<JsonDocument>(csve); //json


            var data = new StringContent(csve, System.Text.Encoding.UTF8, "application/json");
            var url = "http://127.0.0.1:3000/csv";
            var response = await http.PostAsync(url, data);

            HttpResponseMessage httpResponse = await http.GetAsync("http://127.0.0.1:3000/kor");
            var kor = JsonSerializer.Deserialize<JsonDocument>(await httpResponse.Content.ReadAsStringAsync()); //json forma
            //var data = await httpResponse.Content.ReadAsStringAsync(); //forma stringa
            
            return Ok(kor);
        }
        /*
        [HttpGet("preloadAll")]
        public async Task<ActionResult<Loaded>> GetPreloadAll()
        {
            Loaded? fajl1;
            var loadedCsv = await _context.Realestate.ToListAsync();
            var csve = JsonSerializer.Serialize(loadedCsv); //string
            var jsoncsva = JsonSerializer.Deserialize<JsonDocument>(csve); //json


            var data = new StringContent(csve, System.Text.Encoding.UTF8, "application/json");
            var url = "http://127.0.0.1:3000/csv";
            var response = await http.PostAsync(url, data);

            HttpResponseMessage httpResponse = await http.GetAsync("http://127.0.0.1:3000/stats");
            //var stat = JsonSerializer.Deserialize<JsonDocument>(await httpResponse.Content.ReadAsStringAsync());
            var stat = await httpResponse.Content.ReadAsStringAsync();

            HttpResponseMessage httpResponse1 = await http.GetAsync("http://127.0.0.1:3000/kor");
            //var kor = JsonSerializer.Deserialize<JsonDocument>(await httpResponse.Content.ReadAsStringAsync()); //json forma
            var kor = await httpResponse1.Content.ReadAsStringAsync(); //forma stringa

            fajl1.Csv = csve;
            fajl1.Stats = stat;
            fajl1.Kor = kor;
            return Ok(fajl1);
        }
        */
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

            var upgradedName = Name.Substring(0, Name.Length-4);
            int index = 1;
            string modelName = upgradedName + "Model" + index + ".csv";

            string path = Directory.GetCurrentDirectory() + @"\Users\" + Username + "\\" + upgradedName + "\\";
            string pathToCreate = System.IO.Path.Combine(path, modelName); // treba da stoji NameMODEL.csv
            //string pathToCreate = System.IO.Path.Combine(path, name);
            while (System.IO.File.Exists(pathToCreate))
            {
                index++;
                modelName = upgradedName + "Model" + index + ".csv";
                pathToCreate = path + modelName;
            }
            //string modelName1 = upgradedName + "Model" + index + ".csv";

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
