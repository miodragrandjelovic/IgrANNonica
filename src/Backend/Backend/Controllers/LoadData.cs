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
        public static string? Name { get; set; } //Ime ucitanog Csv fajla
        public static string? Username { get; set; } //Ulogovan korisnik

        [HttpPost("savedCsv")] //Otvaranje foldera gde se nalazi izabrani csv
        public async Task<ActionResult<Statistika>> PostSavedCsv(String name)
        {

            string CurrentPath = Directory.GetCurrentDirectory();
            string SelectedPath = CurrentPath + @"\Users\" + Username + "\\" + name;
            if(!System.IO.Directory.Exists(SelectedPath))
            {
                return BadRequest("Ne postoji dati fajl.");
            }
            else if (Username == null)
            {
                return BadRequest("Niste ulogovani.");
            }
            string[] files = Directory.GetFiles(SelectedPath).Select(Path.GetFileName).ToArray();

            return Ok(files);
        }


        [HttpPost("hp")] //Slanje HP na pajton
        public async Task<ActionResult<Hiperparametri>> Post([FromBody] Hiperparametri hiper)
        {
            var hiperjson = JsonSerializer.Serialize(hiper);
            var data = new StringContent(hiperjson, System.Text.Encoding.UTF8, "application/json");
            var url = "http://127.0.0.1:3000/hp";
            var response = await http.PostAsync(url, data);

            var workbookhp = new Workbook();
            var worksheethp = workbookhp.Worksheets[0];
            var layoutOptionshp = new JsonLayoutOptions();
            layoutOptionshp.ArrayAsTable = true;
            JsonUtility.ImportData(hiperjson, worksheethp.Cells, 0, 0, layoutOptionshp);

            var upgradedName = Name.Substring(0, Name.Length - 4);
            int index = 1;
            string hpName = upgradedName + "HP" + index + ".csv";

            string path = Directory.GetCurrentDirectory() + @"\Users\" + Username + "\\" + upgradedName + "\\";
            string pathToCreateHP = System.IO.Path.Combine(path, hpName);

            //                                                                                  hiperparametri                                                                                
            //---------------------------------------------------------------------------------------------------
            //                                                                                  model

            HttpResponseMessage httpResponse = await http.GetAsync("http://127.0.0.1:3000/model");
            var model = JsonSerializer.Deserialize<JsonDocument>(await httpResponse.Content.ReadAsStringAsync()); 
            var dataModel = await httpResponse.Content.ReadAsStringAsync(); 

            var workbook = new Workbook();
            var worksheet = workbook.Worksheets[0];
            var layoutOptions = new JsonLayoutOptions();
            layoutOptions.ArrayAsTable = true;
            JsonUtility.ImportData(dataModel, worksheet.Cells, 0, 0, layoutOptions);

            string modelName = upgradedName + "Model" + index + ".csv";

            string pathToCreate = System.IO.Path.Combine(path, modelName); 

            while (System.IO.File.Exists(pathToCreate))
            {
                index++;
                modelName = upgradedName + "Model" + index + ".csv";
                hpName = upgradedName + "HP" + index + ".csv";
                pathToCreate = path + modelName;
                pathToCreateHP = path + hpName;
            }
            workbook.Save(pathToCreate, SaveFormat.CSV); //cuvanje modela
            workbookhp.Save(pathToCreateHP, SaveFormat.CSV); //cuvanje hiperparametara

            return Ok(model);
        }

        [HttpPost("csv")] //Slanje CSV na pajton
        //[Obsolete]
        public async Task<ActionResult<DataLoad>> PostCsv([FromBody] DataLoad cs)
        {
            string name = cs.Name;
            string csve = cs.CsvData;
            Name = cs.Name;
            PythonController.Name = cs.Name;
            var data = new StringContent(csve, System.Text.Encoding.UTF8, "application/json");
            var url = "http://127.0.0.1:3000/csv";
            var response = await http.PostAsync(url, data);

            HttpResponseMessage httpResponse = await http.GetAsync("http://127.0.0.1:3000/stats");
            var stat = JsonSerializer.Deserialize<JsonDocument>(await httpResponse.Content.ReadAsStringAsync());

            string currentPath = Directory.GetCurrentDirectory();
            var upgradedName = name.Substring(0, name.Length - 4);
            string path = currentPath + @"\Users\" + Username + "\\" + upgradedName;

            if (Directory.Exists(path))
                Console.WriteLine("File is already in system.");
            else
            {
                System.IO.Directory.CreateDirectory(path);
                Console.WriteLine("Directory for '{0}' created successfully!", name);
            }


            //PM> Install-Package Aspose.Cells
            var workbook = new Workbook();
            var worksheet = workbook.Worksheets[0];
            var layoutOptions = new JsonLayoutOptions();
            layoutOptions.ArrayAsTable = true;
            JsonUtility.ImportData(csve, worksheet.Cells, 0, 0, layoutOptions);

            //Pozeljno promeniti model DataLoad tako da pored string CSV sadrzi i string NAME kako bi ja znao ime csv fajla koji je ucitan i kako bih ga sacuvao pod istim imenom u korisnikovom folderu.
            //string path = Directory.GetCurrentDirectory() + @"\Users\"+ Username;
            string pathToCreate = System.IO.Path.Combine(path, name); //umesto AUTOPUT treba staviti NAME koji se salje sa fronta
            //if(!System.IO.Directory.Exists(path))
            //{
            //    return BadRequest("Niste registrovani/ulogovani."+path);
           // }
         //   else
                workbook.Save(pathToCreate, SaveFormat.CSV); 

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
