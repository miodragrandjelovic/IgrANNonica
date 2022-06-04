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
using System.IO;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PythonController : ControllerBase
    {
        private readonly HttpClient http = new HttpClient();
        public static string? Username1 { get; set; } //username poslednje prijavljenog korisnika
        public static string? Name { get; set; } //ime ucitanog csv fajla
        public static string url = "http://127.0.0.1:3000";
        private readonly IConfiguration _configuration;
        private readonly UserDbContext _context;
        public PythonController(UserDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpGet("savedCsvs")] //Vracanje imena sacuvanih fajlova.
        public async Task<ActionResult<String>> GetSavedCsvs(string Username)
        {

            string CurrentPath = Directory.GetCurrentDirectory();
            //string SelectedPath = CurrentPath + @"\Users\" + Username;
            string SelectedPath = System.IO.Path.Combine(CurrentPath, "Users", Username);
            if (Username == null)
            {
                return BadRequest("Niste ulogovani.");
            }

            if (Directory.EnumerateFileSystemEntries(SelectedPath).Any()) //ako nema nijedan folder sa csv-om vracam "Nema sacuvanih datasetova" 
            {
                string[] subdirs = Directory.GetDirectories(SelectedPath).Select(Path.GetFileName).ToArray();
                int br = 0;
                var len = subdirs.Length;
                string[] velicine = new string[len]; //niz sa velicinama csv fajlova
                string[] datumi = new string[len]; //niz sa datumima kreiranja csv fajlova
                string[] imena = new string[len]; //niz sa imenima csv fajlova
                for (int i = 0; i < len; i++)
                {
                    var putanja = System.IO.Path.Combine(SelectedPath, subdirs[i], subdirs[i]+ ".csv");
                    if (System.IO.File.Exists(putanja))
                    {
                        //Console.WriteLine(putanja);
                        var fileName = subdirs[i] + ".csv";
                        imena[br] = subdirs[i];
                        var SelectedPaths = System.IO.Path.Combine(SelectedPath, subdirs[i], fileName);
                        long size = SelectedPaths.Length;
                        FileInfo FileVol = new FileInfo(SelectedPaths);
                        string fileLength = FileVol.Length.ToString();
                        string length = string.Empty;
                        if (FileVol.Length >= (1 << 10))
                        {
                            length = string.Format("{0}Kb", FileVol.Length >> 10);
                            velicine[br] = length;
                        }
                        else
                            velicine[br] = "1Kb";
                        
                        string fileName1 = SelectedPaths;
                        FileInfo fi = new FileInfo(fileName1);
                        DateTime creationTime = fi.CreationTime;
                        datumi[br] = creationTime.ToString();

                        string path1 = System.IO.Path.Combine(CurrentPath, "Users", Username, subdirs[i]);
                        string names = subdirs[i] + "1" + ".csv";
                        string pathToDelete = System.IO.Path.Combine(path1, names);
                       /* 
                        if (System.IO.File.Exists(pathToDelete))
                        {
                            try
                            {
                                var fi2 = new FileInfo(pathToDelete);
                                fi2.Delete();
                                //System.IO.File.Delete(pathToDelete);
                                Console.WriteLine("File " + names + " deleted successfully!");
                            }
                            catch (Exception ex)
                            {
                                Console.WriteLine("{0} Exception thrown file in use. Eventualy it will be deleted.", ex);
                            }
                        }
                        else
                            continue;*/
                        //Console.WriteLine(br);
                        br++;   
                    }
                }
                CsvInfo[] alldata = new CsvInfo[br];
                string vracam = string.Empty;
                for (int i = 0; i < br; i++)
                {
                    CsvInfo csinf = new CsvInfo();

                    csinf.Name = imena[i];
                    csinf.Size = velicine[i];
                    csinf.Date = datumi[i];

                    alldata[i] = csinf;
                }

                return Ok(alldata);
            }
            else
            {
                CsvInfo[] alldata = new CsvInfo[0];
                return Ok(alldata);
            }     
           
        }

        [HttpGet("savedModels")] //Vracanje informacija od svih sacuvanih modela.
        public async Task<ActionResult<Modelinfo>> GetSavedModels(string Username)
        {
            string CurrentPath = Directory.GetCurrentDirectory();
            //string SelectedPath = CurrentPath + @"\Users\" + Username;
            string SelectedPath = System.IO.Path.Combine(CurrentPath, "Users", Username);
            if (Username == null)
            {
                return BadRequest("Niste ulogovani.");
            }
            string[] subdirs = Directory.GetDirectories(SelectedPath).Select(Path.GetFileName).ToArray();
            
            List<string> models = new List<string>();
            List<string> dates = new List<string>();
            List<string> csvs = new List<string>();

            for (int i = 0; i < subdirs.Length; i++)
            {
                string pathing = System.IO.Path.Combine(SelectedPath, subdirs[i]); 
                string[] pomModel = Directory.GetDirectories(pathing).Select(Path.GetFileName).ToArray();
                string[] pomDates = new string[subdirs.Length]; //niz sa datumima kreiranja modela
                for (int j = 0; j < pomModel.Length; j++)
                {
                    models.Add(pomModel[j]);
                    string pathings = System.IO.Path.Combine(pathing, pomModel[j]);
                    string dt = Directory.GetCreationTime(pathings).ToString();
                    dates.Add(dt);
                    csvs.Add(subdirs[i]);
                }
                string path1 = System.IO.Path.Combine(CurrentPath, "Users", Username, subdirs[i]);
                string names = subdirs[i] + "1" + ".csv";
                string pathToDelete = System.IO.Path.Combine(path1, names);
                if (System.IO.File.Exists(pathToDelete))
                {
                    try
                    {
                        var fi2 = new FileInfo(pathToDelete);
                        fi2.Delete();
                        //System.IO.File.Delete(pathToDelete);
                        Console.WriteLine("File " + names + " deleted successfully!");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("{0} Exception thrown file in use. Eventualy it will be deleted.", ex);
                    }
                }
                else
                    continue;
            }
            
            var len = models.Count;
            Modelinfo[] alldata = new Modelinfo[len];

            for (int i = 0; i < len; i++)
            {
                Modelinfo modinfo = new Modelinfo();

                modinfo.Name = models[i];
                modinfo.Date = dates[i];
                modinfo.FromCsv = csvs[i];

                alldata[i] = modinfo;
            }

            return Ok(alldata);
        }

        [HttpGet("publicModels")] //Vracanje informacija od svih javnih modela.
        public async Task<ActionResult<Modelinfo>> GetPublicModels()
        {
            string CurrentPath = Directory.GetCurrentDirectory();
            string SelectedPath = System.IO.Path.Combine(CurrentPath, "Users", "publicProblems");

            string[] subdirs = Directory.GetDirectories(SelectedPath).Select(Path.GetFileName).ToArray();

            List<string> models = new List<string>();
            List<string> dates = new List<string>();
            List<string> users = new List<string>();

            for (int i = 0; i < subdirs.Length; i++)
            {
                int position1 = subdirs[i].IndexOf("(");
                int position2 = subdirs[i].IndexOf(")");
                string modelName = subdirs[i].Substring(0,position1);
                string userName = subdirs[i].Substring(position1+1, position2-position1-1); //startindex + 1, endindex - startindex - 1
                string pathing = System.IO.Path.Combine(SelectedPath, subdirs[i]);
                models.Add(modelName);
                string dt = Directory.GetCreationTime(pathing).ToString();
                dates.Add(dt);
                users.Add(userName); //stavljamo ime korisnika koji je napravio taj model
            }
            var len = models.Count;
            Modelinfo[] alldata = new Modelinfo[len];

            for (int i = 0; i < len; i++)
            {
                Modelinfo modinfo = new Modelinfo();

                modinfo.Name = models[i];
                modinfo.Date = dates[i];
                modinfo.FromCsv = users[i]; //da li staviti iz kog csv-a je kreirani model ili koji korisnik ga je kreirao?!

                alldata[i] = modinfo;
            }
            return Ok(alldata);
        }

        [HttpGet("publicDatasets")] //Vracanje informacija od svih javnih Datasetova.
        public async Task<ActionResult<Modelinfo>> GetPublicDatasets()
        {
            string CurrentPath = Directory.GetCurrentDirectory();
            string SelectedPath = System.IO.Path.Combine(CurrentPath, "Users", "publicDatasets");

            string[] subdirs = Directory.GetDirectories(SelectedPath).Select(Path.GetFileName).ToArray();

            var len = subdirs.Length;
            string[] velicine = new string[len]; //niz sa velicinama csv fajlova
            string[] datumi = new string[len]; //niz sa datumima kreiranja csv fajlova
            CsvInfo[] alldata = new CsvInfo[len];

            for (int i = 0; i < len; i++)
            {
                var fileName = subdirs[i] + ".csv";
                var SelectedPaths = System.IO.Path.Combine(SelectedPath, subdirs[i], fileName);
                long size = SelectedPaths.Length;
                FileInfo FileVol = new FileInfo(SelectedPaths);
                string fileLength = FileVol.Length.ToString();
                string length = string.Empty;
                if (FileVol.Length >= (1 << 10))
                {
                    length = string.Format("{0}Kb", FileVol.Length >> 10);
                    velicine[i] = length;
                }
                else
                    velicine[i] = "1Kb";

                string fileName1 = SelectedPaths;
                FileInfo fi = new FileInfo(fileName1);
                DateTime creationTime = fi.CreationTime;
                datumi[i] = creationTime.ToString();
            }
            for (int i = 0; i < len; i++)
            {
                CsvInfo csinf = new CsvInfo();

                csinf.Name = subdirs[i];
                csinf.Size = velicine[i];
                csinf.Date = datumi[i];

                alldata[i] = csinf;
            }

            return Ok(alldata);
        }

        [HttpGet("preloadCsv")] //Vracanje ucitanog csv fajla iz baze.
        public async Task<ActionResult<IEnumerable<Realestate>>> GetPreloadCsv()
        {
            var loadedCsv = await _context.Realestate.ToListAsync(); //lista/json
            string jsoncsv = JsonSerializer.Serialize(loadedCsv); //string
            string csve = jsoncsv;
            var data = new StringContent(csve, System.Text.Encoding.UTF8, "application/json");
            var urlcsv = url + "/csv";
            var response = await http.PostAsync(urlcsv, data);

            return Ok(csve);
        }


        [HttpGet("preloadStat")] 
        public async Task<ActionResult<JsonDocument>> GetPreloadStat()
        {
            var loadedCsv = await _context.Realestate.ToListAsync();
            var csve = JsonSerializer.Serialize(loadedCsv); //string
            var jsoncsva = JsonSerializer.Deserialize<JsonDocument>(csve); //json
            
            var data = new StringContent(csve, System.Text.Encoding.UTF8, "application/json");
            //var url = "http://127.0.0.1:3000/csv";
            var urlcsv = url + "/csv";
            var response = await http.PostAsync(urlcsv, data);

            var urlst = url + "/stats";
            HttpResponseMessage httpResponse = await http.GetAsync(urlst);
            var stat = JsonSerializer.Deserialize<JsonDocument>(await httpResponse.Content.ReadAsStringAsync());

            return Ok(stat);
        }

        [HttpGet("preloadKor")]
        public async Task<ActionResult<JsonDocument>> GetPreloadKor()
        {
            var loadedCsv = await _context.Realestate.ToListAsync();
            var csve = JsonSerializer.Serialize(loadedCsv); //string
            var jsoncsva = JsonSerializer.Deserialize<JsonDocument>(csve); //json

            var data = new StringContent(csve, System.Text.Encoding.UTF8, "application/json");
            //var url = "http://127.0.0.1:3000/csv";
            var urlcsv = url + "/csv";
            var response = await http.PostAsync(urlcsv, data);

            var urlkor = url + "/kor";
            HttpResponseMessage httpResponse = await http.GetAsync(urlkor);
            var kor = JsonSerializer.Deserialize<JsonDocument>(await httpResponse.Content.ReadAsStringAsync()); //json forma
            //var data = await httpResponse.Content.ReadAsStringAsync(); //forma stringa
            
            return Ok(kor);
        }

        [HttpGet("preloadCsvClass")] //Vracanje ucitanog klasifikacionog csv fajla iz baze.
        public async Task<ActionResult<IEnumerable<Mpg>>> GetPreloadCsvClass()
        {
            var loadedCsv = await _context.Mpg.ToListAsync(); //lista/json
            string jsoncsv = JsonSerializer.Serialize(loadedCsv); //string
            string csve = jsoncsv;
            var data = new StringContent(csve, System.Text.Encoding.UTF8, "application/json");
            var urlcsv = url + "/csv";
            var response = await http.PostAsync(urlcsv, data);

            return Ok(csve);
        }

        [HttpGet("preloadStatClass")] //statistika za klasifikacioni 
        public async Task<ActionResult<JsonDocument>> GetPreloadStatClass()
        {
            var loadedCsv = await _context.Mpg.ToListAsync();
            var csve = JsonSerializer.Serialize(loadedCsv); //string
            var jsoncsva = JsonSerializer.Deserialize<JsonDocument>(csve); //json

            var data = new StringContent(csve, System.Text.Encoding.UTF8, "application/json");
            //var url = "http://127.0.0.1:3000/csv";
            var urlcsv = url + "/csv";
            var response = await http.PostAsync(urlcsv, data);

            var urlstat = url + "/stats";
            HttpResponseMessage httpResponse = await http.GetAsync(urlstat);
            var stat = JsonSerializer.Deserialize<JsonDocument>(await httpResponse.Content.ReadAsStringAsync());

            return Ok(stat);
        }

        [HttpGet("preloadKorClass")]
        public async Task<ActionResult<JsonDocument>> GetPreloadKorClass()
        {
            var loadedCsv = await _context.Mpg.ToListAsync();
            var csve = JsonSerializer.Serialize(loadedCsv); //string
            var jsoncsva = JsonSerializer.Deserialize<JsonDocument>(csve); //json

            var data = new StringContent(csve, System.Text.Encoding.UTF8, "application/json");
            //var url = "http://127.0.0.1:3000/csv";
            var urlcsv = url + "/csv";
            var response = await http.PostAsync(urlcsv, data);

            var urlkor = url + "/kor";
            HttpResponseMessage httpResponse = await http.GetAsync(urlkor);
            var kor = JsonSerializer.Deserialize<JsonDocument>(await httpResponse.Content.ReadAsStringAsync()); //json forma
            //var data = await httpResponse.Content.ReadAsStringAsync(); //forma stringa

            return Ok(kor);
        }
        
        [HttpGet("stats")] //Primanje statistickih parametara iz pajtona 
        public async Task<ActionResult<JsonDocument>> GetStat()
        {
            var urlstat = url + "/stats";
            HttpResponseMessage httpResponse = await http.GetAsync(urlstat);
            var stat = JsonSerializer.Deserialize<JsonDocument>(await httpResponse.Content.ReadAsStringAsync());
            return Ok(stat);
        }

        [HttpGet("hp")] //Primanje HP iz pajtona 
        public async Task<ActionResult<Hiperparametri>> GetHp()
        {
            var urlhp = url + "/hp";
            HttpResponseMessage httpResponse = await http.GetAsync(urlhp);
            var hp = JsonSerializer.Deserialize<JsonDocument>(await httpResponse.Content.ReadAsStringAsync()); 
            return Ok(hp);
        }

        [HttpGet("csv")] //Primanje CSV iz pajtona 
        public async Task<ActionResult<JsonDocument>> GetCsv()
        {
            var urlcsv = url + "/csv";
            HttpResponseMessage httpResponse = await http.GetAsync(urlcsv);
            var csv = JsonSerializer.Deserialize<JsonDocument>(await httpResponse.Content.ReadAsStringAsync()); //json forma
            //var data = await httpResponse.Content.ReadAsStringAsync(); //forma stringa
            return Ok(csv);
        }

        [HttpGet("kor")] //Primanje kor_mat iz pajtona 
        public async Task<ActionResult<JsonDocument>> GetKor()
        {
            var urlkor = url + "/kor";
            HttpResponseMessage httpResponse = await http.GetAsync(urlkor);
            var kor = JsonSerializer.Deserialize<JsonDocument>(await httpResponse.Content.ReadAsStringAsync()); //json forma
            //var data = await httpResponse.Content.ReadAsStringAsync(); //forma stringa
            return Ok(kor);
        }

        [HttpGet("model")] //Primanje Modela iz pajtona 
        public async Task<ActionResult<JsonDocument>> GetModel(string Username)
        {
            var urlmodel = url + "/model";
            HttpResponseMessage httpResponse = await http.GetAsync(urlmodel);
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

            //string path = Directory.GetCurrentDirectory() + @"\Users\" + Username + "\\" + upgradedName + "\\";
            string CurrentPath = Directory.GetCurrentDirectory();
            string path = System.IO.Path.Combine(CurrentPath, "Users", Username, upgradedName);
            string pathToCreate = System.IO.Path.Combine(path, modelName); // treba da stoji NameMODEL.csv
            //string pathToCreate = System.IO.Path.Combine(path, name);
            while (System.IO.File.Exists(pathToCreate))
            {
                index++;
                modelName = upgradedName + "Model" + index + ".csv";
                pathToCreate = System.IO.Path.Combine(path, modelName);
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
