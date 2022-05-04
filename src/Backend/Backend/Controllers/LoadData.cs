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
        public static string? DirName { get; set; } //Ime foldera 

        public static string url = "http://127.0.0.1:3000";
        static String BytesToString(long byteCount) //proveriti sta ne radi kod ove funkcije
        {
            string[] suf = { "B", "KB", "MB", "GB", "TB", "PB", "EB" }; 
            if (byteCount == 0)
                return "0" + suf[0];
            long bytes = Math.Abs(byteCount);
            int place = Convert.ToInt32(Math.Floor(Math.Log(bytes, 1024)));
            double num = Math.Round(bytes / Math.Pow(1024, place), 1);
            return (Math.Sign(byteCount) * num).ToString() + suf[place];
        }


        [HttpPost("selectedCsv")] //Otvaranje foldera gde se nalazi izabrani csv
        public async Task<ActionResult<String>> PostSelectedCsv(String name)
        {
            string fileName = name + ".csv";
            string CurrentPath = Directory.GetCurrentDirectory();
            //string SelectedPath = CurrentPath + @"\Users\" + Username + "\\" + name;
            string SelectedPath = Path.Combine(CurrentPath, "Users", Username, name);
            if (!System.IO.Directory.Exists(SelectedPath))
            {
                return BadRequest("Ne postoji dati fajl.");
            }
            else if (Username == null)
            {
                return BadRequest("Niste ulogovani.");
            }

            string[] files = Directory.GetFiles(SelectedPath).Select(Path.GetFileName).ToArray();

            //string SelectedPaths = CurrentPath + @"\Users\" + Username + "\\" + name + "\\" + fileName;
            string SelectedPaths = Path.Combine(CurrentPath, "Users", Username, name, fileName);
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

            var data = new StringContent(result, System.Text.Encoding.UTF8, "application/json");
            //var url = "http://127.0.0.1:3000/csv";
            var csvurl = url + "/csv";
            var response = await http.PostAsync(csvurl, data);

           
            long size = SelectedPaths.Length;
            var size1 = BytesToString(size);
            //Console.WriteLine("Size of file: " + size1);
            

            string fileName1 = SelectedPaths;
            FileInfo fi = new FileInfo(fileName1);
            DateTime creationTime = fi.CreationTime;
           //Console.WriteLine("Creation time: {0}", creationTime);
            return Ok(resultjson);
        }

        [HttpPost("savedModels")] //Vracanje imena sacuvanih Modela.
        public async Task<ActionResult<String>> PostSavedModels(String name)
        {
            DirName = name;
            RegistracijaUseraController.DirName = name;
            string CsvName = name;
            string CurrentPath = Directory.GetCurrentDirectory();
            //string SelectedPath = CurrentPath + @"\Users\" + Username + "\\" + CsvName;
            string SelectedPath = Path.Combine(CurrentPath, "Users", Username, CsvName);
            if (Username == null)
            {
                return BadRequest("Niste ulogovani.");
            }
            string[] subdirs = Directory.GetDirectories(SelectedPath).Select(Path.GetFileName).ToArray();

            return Ok(subdirs);
        }

        //predikcija
        [HttpPost("selectedModel")] //Vracanje imena izabranog modela. Tacnije putanje to je bitno zbog predikcije da znaju na ML-u koji model je korisnik izabrao
        public async Task<ActionResult<JsonDocument>> PostSelectedModel(String name)
        {
            if (Username == null)
            {
                return BadRequest("Niste ulogovani.");
            }
            string CurrentPath = Directory.GetCurrentDirectory();
            //string SelectedPath = CurrentPath + @"\Users\" + Username + "\\" + DirName + "\\" + name;
            string SelectedPath = Path.Combine(CurrentPath, "Users", Username, DirName, name);

            var modelName = name;
            var data = new StringContent(modelName, System.Text.Encoding.UTF8, "application/text");
            //var url = "http://127.0.0.1:3000/savedModel";
            var modelurl = url + "/savedModel";
            var response = await http.PostAsync(modelurl, data);
            return Ok(SelectedPath);

        }

        //za poredjenje dva modela
        [HttpPost("modelForCompare")] //Vracanje vrednosti izabranog modela kako bi mogle da se prikazu na grafiku i uporede.
        public async Task<ActionResult<JsonDocument>> PostModelForCompare(String dirname, String modelname)
        {
            string CurrentPath = Directory.GetCurrentDirectory();
            string fileName = modelname + ".csv";
            string SelectedPath = Path.Combine(CurrentPath, "Users", Username, dirname, modelname, fileName);

            if (!System.IO.File.Exists(SelectedPath))
            {
                return BadRequest("Ne postoji dati model. " + SelectedPath);
            }
            else if (Username == null)
            {
                return BadRequest("Niste ulogovani.");
            }
           
            var modelTable = new DataTable();
            using (var csvReader = new LumenWorks.Framework.IO.Csv.CsvReader(new StreamReader(System.IO.File.OpenRead(SelectedPath)), true))
            {
                modelTable.Load(csvReader);
            }
            string result = string.Empty;
            result = JsonConvert.SerializeObject(modelTable);

            var resultjson = System.Text.Json.JsonSerializer.Deserialize<JsonDocument>(result); 

            return Ok(resultjson);
        }

        [HttpPost("save")] //pravljenje foldera gde ce se cuvati model cuva se model samo kad korisnik klikne na dugme sacuvaj model
        public async Task<ActionResult>Post(String modelNames) //Ime modela kako korisnik zeli da ga cuva
        {
            if (Username != null)
            {
                string CurrentPath = Directory.GetCurrentDirectory();
                var upgradedName = Name.Substring(0, Name.Length - 4);
                string path = Path.Combine(CurrentPath, "Users", Username, upgradedName);
                string modeldirname = Path.Combine(CurrentPath, "Users", Username, upgradedName, modelNames);
                if (System.IO.Directory.Exists(modeldirname))
                {
                    return Ok("Vec postoji model sa tim imenom.");
                }
                else
                {
                    System.IO.Directory.CreateDirectory(modeldirname);
                    Console.WriteLine("Directory for new Model created successfully!");
                }

                var pathjson = System.Text.Json.JsonSerializer.Serialize(modeldirname);
                var pathdata = new StringContent(modeldirname, System.Text.Encoding.UTF8, "application/json");
                //var  = "http://127.0.0.1:3000/pathModel";
                var pathurl = url + "/pathModel";
                var pathresponse = await http.PostAsync(pathurl, pathdata);
                return Ok(modeldirname);
            }
            else
                return Ok("Korisnik nije ulogovan.");
        }

        [HttpPost("hp")] //Slanje HP na pajton
        public async Task<ActionResult<Hiperparametri>> Post([FromBody] Hiperparametri hiper, String modelNames) //pored hiperparametara da se posalje i ime modela kako korisnik zeli da ga cuva cuva se model pri svakom treniranju
        {
            int indexDir = 1;
            var upgradedName = "realestate";
            if(Name != null)
                upgradedName = Name.Substring(0, Name.Length - 4);
            //string path = Directory.GetCurrentDirectory() + @"\Users\" + Username + "\\" + upgradedName + "\\";
            string CurrentPath = Directory.GetCurrentDirectory();
            

            if (Username != null)
            {
                string path = Path.Combine(CurrentPath, "Users", Username, upgradedName);
                string modeldirname = Path.Combine(CurrentPath, "Users", Username, upgradedName, modelNames); //kada se prosledjuje ime zajedno sa hiperparametrima i uvek cuva
                //string modeldirname = upgradedName + modelNames;
                if (System.IO.Directory.Exists(modeldirname))
                {
                    return Ok("Vec postoji model sa tim imenom.");
                }
                else
                {
                    System.IO.Directory.CreateDirectory(modeldirname);
                    Console.WriteLine("Directory for new Model created successfully!");
                }
                /*string modelDirName = upgradedName + "Model" + indexDir;
                string pathToCreateDir = System.IO.Path.Combine(path, modelDirName);
                while (System.IO.Directory.Exists(pathToCreateDir))
                {
                    indexDir++;
                    modelDirName = upgradedName + "Model" + indexDir;
                    pathToCreateDir = System.IO.Path.Combine(path, modelDirName);
                }
                System.IO.Directory.CreateDirectory(pathToCreateDir);
                Console.WriteLine("Directory for new Model created successfully!");*/

                var pathjson = System.Text.Json.JsonSerializer.Serialize(modeldirname);
                var pathdata = new StringContent(modeldirname, System.Text.Encoding.UTF8, "application/json");
                //var  = "http://127.0.0.1:3000/pathModel";
                var pathurl = url + "/pathModel";
                var pathresponse = await http.PostAsync(pathurl, pathdata);
            }
            
            hiper.Username = Username;
            var hiperjson = System.Text.Json.JsonSerializer.Serialize(hiper);
            var data = new StringContent(hiperjson, System.Text.Encoding.UTF8, "application/json");
            //var url = "http://127.0.0.1:3000/hp";
            var hpurl = url + "/hp";
            var response = await http.PostAsync(hpurl, data);            

            //                                                                                  hiperparametri                                                                                
            //---------------------------------------------------------------------------------------------------
            //                                                                                  model
            var modelurl = url + "/model";
            HttpResponseMessage httpResponse = await http.GetAsync(modelurl);
            //var model = System.Text.Json.JsonSerializer.Deserialize<JsonDocument>(await httpResponse.Content.ReadAsStringAsync()); 
            //var dataModel = await httpResponse.Content.ReadAsStringAsync(); 
            var dataModel = ""; //mora ovako dok se ne popravi primanje hiperparametara na ML delu
            if(Username != null)
            {
                int index = 1;
                //string hpName = modelNames + "HP" + index + ".csv";
                string hpName = modelNames + "HP.csv";
                string path = Path.Combine(CurrentPath, "Users", Username, upgradedName, modelNames);
                string pathToCreateHP = System.IO.Path.Combine(path, hpName);

                var workbookhp = new Workbook();
                var worksheethp = workbookhp.Worksheets[0];
                var layoutOptionshp = new JsonLayoutOptions();
                layoutOptionshp.ArrayAsTable = true;
                JsonUtility.ImportData(hiperjson, worksheethp.Cells, 0, 0, layoutOptionshp);


                var workbook = new Workbook();
                var worksheet = workbook.Worksheets[0];
                var layoutOptions = new JsonLayoutOptions();
                layoutOptions.ArrayAsTable = true;
                JsonUtility.ImportData(dataModel, worksheet.Cells, 0, 0, layoutOptions);

                //string modelName = modelNames + "Model" + index + ".csv";
                string modelName = "deleteme.csv";
                string pathToCreate = System.IO.Path.Combine(path, modelName);
                
                while (System.IO.File.Exists(pathToCreateHP))
                {
                    index++;
                    modelName = modelNames + "Model" + index + ".csv";
                    hpName = modelNames + "HP" + index + ".csv";
                    pathToCreate = System.IO.Path.Combine(path, modelName);
                    pathToCreateHP = System.IO.Path.Combine(path, hpName);
                }
               
                workbook.Save(pathToCreate, SaveFormat.CSV); //cuvanje modela
                workbookhp.Save(pathToCreateHP, SaveFormat.CSV); //cuvanje hiperparametara


                List<String> lines = new List<string>();
                string line;
                System.IO.StreamReader file = new System.IO.StreamReader(pathToCreate);

                while ((line = file.ReadLine()) != null)
                {
                    lines.Add(line);
                    //Console.WriteLine(line);
                }

                lines.RemoveAll(l => l.Contains("Evaluation Only."));

                string model = modelNames + ".csv";
                string pathToCreate12 = System.IO.Path.Combine(path, model);
                using (System.IO.StreamWriter outfile = new System.IO.StreamWriter(pathToCreate12))
                {
                    outfile.Write(String.Join(System.Environment.NewLine, lines.ToArray()));
                }

                //string path1 = Directory.GetCurrentDirectory() + @"\Users\" + Username + "\\" + upgradedName;
                string path1 = System.IO.Path.Combine(CurrentPath, "Users", Username, upgradedName);
                string names = upgradedName + "1" + ".csv";
                string pathToDelete = System.IO.Path.Combine(path1, names);
                if (System.IO.File.Exists(pathToDelete))
                {
                    //System.IO.File.Delete(pathToDelete);
                }

            }
            else
                Console.WriteLine("Niste ulogovani.");
            return Ok(hiperjson);//model se vraca
        }


        [HttpPost("hpNeprijavljen")] //Slanje HP na pajton za neprijavljenog korisnika
        public async Task<ActionResult<Hiperparametri>> PostHp([FromBody] Hiperparametri hiper) 
        {
            hiper.Username = "unknown";
            var hiperjson = System.Text.Json.JsonSerializer.Serialize(hiper);
            var data = new StringContent(hiperjson, System.Text.Encoding.UTF8, "application/json");
            //var url = "http://127.0.0.1:3000/hp";
            var hpurl = url + "/hp";
            var response = await http.PostAsync(hpurl, data);

            //                                                                                  hiperparametri                                                                                
            //---------------------------------------------------------------------------------------------------
            //                                                                                  model
            var modelurl = url + "/model";
            HttpResponseMessage httpResponse = await http.GetAsync(modelurl);
            //var model = System.Text.Json.JsonSerializer.Deserialize<JsonDocument>(await httpResponse.Content.ReadAsStringAsync()); 
            //var dataModel = await httpResponse.Content.ReadAsStringAsync(); 
            var dataModel = ""; //mora ovako dok se ne popravi primanje hiperparametara na ML delu

            return Ok(hiperjson);//model se vraca ali dok se ne popravi na ML-u to mora ovako
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
            //var url = "http://127.0.0.1:3000/csv";
            var urlcsv = url + "/csv";
            var response = await http.PostAsync(urlcsv, data);

            var statsurl = url + "/stats";
            HttpResponseMessage httpResponse = await http.GetAsync(statsurl);
            var stat = System.Text.Json.JsonSerializer.Deserialize<JsonDocument>(await httpResponse.Content.ReadAsStringAsync());

            string currentPath = Directory.GetCurrentDirectory();
            var upgradedName = name.Substring(0, name.Length - 4);
            //string path = currentPath + @"\Users\" + Username + "\\" + upgradedName;

            string pathToCreate = "";
            if (Username != null)
            {
                string path = System.IO.Path.Combine(currentPath, "Users", Username, upgradedName);
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
                    pathToCreate = System.IO.Path.Combine(path, names); 
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
                        //Console.WriteLine(line);
                    }

                    lines.RemoveAll(l => l.Contains("Evaluation Only."));

                    string pathToCreate12 = System.IO.Path.Combine(path, name);
                    using (System.IO.StreamWriter outfile = new System.IO.StreamWriter(pathToCreate12))
                    {
                        outfile.Write(String.Join(System.Environment.NewLine, lines.ToArray()));
                    }

                    /*if (System.IO.File.Exists(pathToCreate))
                    {
                        System.IO.File.Delete(pathToCreate);
                    }*/
                }
            }
            else
                Console.WriteLine("Niste ulogovani.");

            //System.IO.File.Delete(pathToCreate);
            return Ok(stat);
        }

        [HttpPost("predictionCsv")] //Slanje csv fajla za predikciju na pajton i primanje predikcije i prosledjivanje na front preko responsa.
        //[Obsolete]
        public async Task<ActionResult<DataLoad>> PostPredictedCsv([FromBody] DataLoad cs)
        {
            string name = cs.Name;
            string csve = cs.CsvData;
            Name = cs.Name;
            PythonController.Name = cs.Name;
            var data = new StringContent(csve, System.Text.Encoding.UTF8, "application/json");
            //var url = "http://127.0.0.1:3000/predictionCsv"; //slanje csv-a za prediktovanje na pajton
            var urlpred = url + "/predictionCsv";
            var response = await http.PostAsync(urlpred, data);

            var predurl = url + "/prediction";
            HttpResponseMessage httpResponse = await http.GetAsync(predurl); //rezultati predikcije
            var predikcija = System.Text.Json.JsonSerializer.Deserialize<JsonDocument>(await httpResponse.Content.ReadAsStringAsync());

            return Ok(predikcija);
        }

        [HttpPost("stats")] //Slanje Stats na pajton
        public async Task<ActionResult<Statistika>> PostStat(Statistika stat)
        {
            var statjson = System.Text.Json.JsonSerializer.Serialize(stat);
            var data = new StringContent(statjson, System.Text.Encoding.UTF8, "application/json");
            //var url = "http://127.0.0.1:3000/stats";
            var urlst = url + "/stats";
            var response = await http.PostAsync(urlst, data);
            return Ok(statjson);
        }

    }
}
