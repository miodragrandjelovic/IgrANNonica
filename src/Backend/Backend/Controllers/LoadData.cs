using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text;
using Backend.Models;
using System.Text.Json.Nodes;
using System.Net.Http.Json;
using Aspose.Cells;
using Aspose.Cells.Utility;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoadData : ControllerBase
    {
        private readonly HttpClient http = new HttpClient();
        public static Hiperparametri hp = new Hiperparametri();


        [HttpPost("hp")] //Slanje HP na pajton
        public async Task<ActionResult<Hiperparametri>> Post([FromBody] Hiperparametri hiper)
        {
            var hiperjson = JsonSerializer.Serialize(hiper);
            var data = new StringContent(hiperjson, System.Text.Encoding.UTF8, "application/json");
            var url = "http://127.0.0.1:3000/hp";
            var response = await http.PostAsync(url, data);
            //var hiperparametars = JsonSerializer.Deserialize<Hiperparametri>(await response.Content.ReadAsStringAsync());
            return Ok(hiperjson);
        }

        [HttpPost("csv")] //Slanje CSV na pajton
        //[Obsolete]
        public async Task<ActionResult<DataLoad>> PostCsv([FromBody] DataLoad cs)
        {
            string csve = cs.CsvData;
            var data = new StringContent(csve, System.Text.Encoding.UTF8, "application/json");
            var url = "http://127.0.0.1:3000/csv";
            var response = await http.PostAsync(url, data);

            HttpResponseMessage httpResponse = await http.GetAsync("http://127.0.0.1:3000/stats");
            var stat = JsonSerializer.Deserialize<JsonDocument>(await httpResponse.Content.ReadAsStringAsync());

            //PM> Install-Package Aspose.Cells
            var workbook = new Workbook();
            var worksheet = workbook.Worksheets[0];
            var layoutOptions = new JsonLayoutOptions();
            layoutOptions.ArrayAsTable = true;
            JsonUtility.ImportData(csve, worksheet.Cells, 0, 0, layoutOptions);

            //Treba doci do Username-a ulogovanog korisnika i staviti da se u njegov folder cuva ucitani csv.
            //Pozeljno promeniti model DataLoad tako da pored string CSV sadrzi i string NAME kako bi ja znao ime csv fajla koji je ucitan i kako bih ga sacuvao pod istim imenom u korisnikovom folderu.
            string path = Directory.GetCurrentDirectory() + @"\Users";// + "nikola"; treba dodati USERNAME od ulogovanog korisnika
            string pathToCreate = System.IO.Path.Combine(path, "AUTOPUT.csv"); //umesto AUTOPUT treba staviti ime pravog fajla
            
            if(System.IO.File.Exists(pathToCreate))
            {
                return BadRequest("Ucitani fajl je vec u bazi.");
            }
            else
                workbook.Save(pathToCreate, SaveFormat.CSV); //trenutno cuva sve u folderu USERS

            return Ok(stat);
        }

        [HttpPost("stats")] //Slanje Stats na pajton
        public async Task<ActionResult<Statistika>> PostStat(Statistika stat)
        {
            var statjson = JsonSerializer.Serialize(stat);
            var data = new StringContent(statjson, System.Text.Encoding.UTF8, "application/json");
            var url = "http://127.0.0.1:3000/stats";
            var response = await http.PostAsync(url, data);
            return Ok(statjson);
        }

    }
}
