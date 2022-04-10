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
using System.IO;
using CsvHelper;
using System.Globalization;
using System.Data;
using LumenWorks.Framework.IO.Csv;
using Newtonsoft.Json;

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

        [HttpPost("selectedCsv")] //Otvaranje foldera gde se nalazi izabrani csv
        public async Task<ActionResult<String>> PostSelectedCsv(String name)
        {
            string fileName = name + ".csv";
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

            string SelectedPaths = CurrentPath + @"\Users\" + Username + "\\" + name + "\\" + fileName;
            /*var reader = new StreamReader(SelectedPaths);
            var csv = new CsvHelper.CsvReader(reader, CultureInfo.InvariantCulture);
            List<JsonDocument> cList = csv.GetRecords<JsonDocument>().ToList();*/

            var csvTable = new DataTable();
            using (var csvReader = new LumenWorks.Framework.IO.Csv.CsvReader(new StreamReader(System.IO.File.OpenRead(SelectedPaths)), true))
            {
                csvTable.Load(csvReader);
            }
            //csvTable.Rows.RemoveAt(csvTable.Rows.Count - 1);
            string result = string.Empty;
            result = JsonConvert.SerializeObject(csvTable);

            var resultjson = System.Text.Json.JsonSerializer.Deserialize<JsonDocument>(result); //json
            return Ok(resultjson);
        }

        [HttpPost("savedModels")] //Vracanje imena sacuvanih Modela.
        public async Task<ActionResult<String>> PostSavedModels(String name)
        {
            string CsvName = name;
            string CurrentPath = Directory.GetCurrentDirectory();
            string SelectedPath = CurrentPath + @"\Users\" + Username + "\\" + CsvName;
            if (Username == null)
            {
                return BadRequest("Niste ulogovani.");
            }
            string[] subdirs = Directory.GetDirectories(SelectedPath).Select(Path.GetFileName).ToArray();

            return Ok(subdirs);
        }


        [HttpPost("hp")] //Slanje HP na pajton
        public async Task<ActionResult<Hiperparametri>> Post([FromBody] Hiperparametri hiper)
        {
            var hiperjson = System.Text.Json.JsonSerializer.Serialize(hiper);
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
            var model = System.Text.Json.JsonSerializer.Deserialize<JsonDocument>(await httpResponse.Content.ReadAsStringAsync()); 
            var dataModel = await httpResponse.Content.ReadAsStringAsync(); 

            if(Username != null)
            {
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
            
                string path1 = Directory.GetCurrentDirectory() + @"\Users\" + Username + "\\" + upgradedName;
                string names = upgradedName + "1" + ".csv";
                string pathToDelete = System.IO.Path.Combine(path1, names);
                if (System.IO.File.Exists(pathToDelete))
                {
                    //System.IO.File.Delete(pathToDelete);
                }
            }
            else
                Console.WriteLine("Niste ulogovani.");
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
            var stat = System.Text.Json.JsonSerializer.Deserialize<JsonDocument>(await httpResponse.Content.ReadAsStringAsync());

            string currentPath = Directory.GetCurrentDirectory();
            var upgradedName = name.Substring(0, name.Length - 4);
            string path = currentPath + @"\Users\" + Username + "\\" + upgradedName;


            if(Username != null)
            {
                if (Directory.Exists(path))
                    Console.WriteLine("File is already in system.");
                else
                {
                    System.IO.Directory.CreateDirectory(path);
                    Console.WriteLine("Directory for '{0}' created successfully!", name);
                
                    var workbook = new Workbook();
                    var worksheet = workbook.Worksheets[0];
                    var layoutOptions = new JsonLayoutOptions();
                    layoutOptions.ArrayAsTable = true;
                    JsonUtility.ImportData(csve, worksheet.Cells, 0, 0, layoutOptions);

                    //string path = Directory.GetCurrentDirectory() + @"\Users\"+ Username;
                    string names = upgradedName + "1" + ".csv";
                    string pathToCreate = System.IO.Path.Combine(path, names); 
                    //if(!System.IO.Directory.Exists(path))
                    //{
                    //    return BadRequest("Niste registrovani/ulogovani."+path);
                   // }
                 //   else
                        workbook.Save(pathToCreate, SaveFormat.CSV);
            
                    List<String> lines = new List<string>();
                    string line;
                    System.IO.StreamReader file = new System.IO.StreamReader(pathToCreate);

                    while ((line = file.ReadLine()) != null)
                    {
                        lines.Add(line);
                        Console.WriteLine(line);
                    }

                    lines.RemoveAll(l => l.Contains("Evaluation Only."));
                    /*if(System.IO.File.Exists(pathToCreate))
                    {
                        System.IO.File.Delete(pathToCreate);
                    }*/
            
            
                    string pathToCreate12 = System.IO.Path.Combine(path, name);
                    using (System.IO.StreamWriter outfile = new System.IO.StreamWriter(pathToCreate12))
                    {
                        outfile.Write(String.Join(System.Environment.NewLine, lines.ToArray()));
                    }
                }
            }
            else
                Console.WriteLine("Niste ulogovani.");
            return Ok(stat);
        }

        [HttpPost("stats")] //Slanje Stats na pajton
        public async Task<ActionResult<Statistika>> PostStat(Statistika stat)
        {
            var statjson = System.Text.Json.JsonSerializer.Serialize(stat);
            var data = new StringContent(statjson, System.Text.Encoding.UTF8, "application/json");
            var url = "http://127.0.0.1:3000/stats";
            var response = await http.PostAsync(url, data);
            return Ok(statjson);
        }

    }
}
