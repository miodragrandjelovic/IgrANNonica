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
using JsonSerializer = System.Text.Json.JsonSerializer;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Headers;
using CsvHelper.Configuration;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoadData : ControllerBase
    {
        private readonly HttpClient http = new HttpClient();
        public static Hiperparametri hp = new Hiperparametri();
        public static string? Name { get; set; } //Ime ucitanog Csv fajla
        public static string? Username1 { get; set; } //Ulogovan korisnik
        public static string? DirName { get; set; } //Ime foldera 

        public static string url = "http://127.0.0.1:3000";

        public static string hiperJ;
        public static string modelSave;


        public class SaveData
        {
            public string hiperj { get; set; } = string.Empty;
            public string modelsave { get; set; } = string.Empty;
        }

        public static Dictionary<string, SaveData> dict_save = new Dictionary<string, SaveData>(99);

        private readonly IConfiguration _configuration;
        private readonly UserDbContext _context;
        public LoadData(UserDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
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
        public async Task<ActionResult<String>> PostSelectedCsv(String name, string Username) 
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
            string SelectedPaths = Path.Combine(CurrentPath, "Users", Username, name, fileName);

            var csvTable = new DataTable();
            using (var csvReader = new LumenWorks.Framework.IO.Csv.CsvReader(new StreamReader(System.IO.File.OpenRead(SelectedPaths)), true))
            {
                csvTable.Load(csvReader);
            }
            string result = string.Empty;
            result = JsonConvert.SerializeObject(csvTable);

            var resultjson = System.Text.Json.JsonSerializer.Deserialize<JsonDocument>(result); //json

            var data = new StringContent(result, System.Text.Encoding.UTF8, "application/json");
            //var url = "http://127.0.0.1:3000/csv";
            var csvurl = url + "/csv";
            var response = await http.PostAsync(csvurl, data);


            long size = SelectedPaths.Length;
            var size1 = BytesToString(size);

            string fileName1 = SelectedPaths;
            FileInfo fi = new FileInfo(fileName1);
            DateTime creationTime = fi.CreationTime;
            Name = name;
            return Ok(resultjson);
        }

        [HttpPost("publicCsv")] //Otvaranje foldera gde se nalazi izabrani csv
        public async Task<ActionResult<String>> PostPublicCsv(String name)
        {
            string fileName = name + ".csv";
            string CurrentPath = Directory.GetCurrentDirectory();
            //string SelectedPath = CurrentPath + @"\Users\" + Username + "\\" + name;
            string SelectedPath = Path.Combine(CurrentPath, "Users", "publicDatasets", name);
            if (!System.IO.Directory.Exists(SelectedPath))
            {
                return BadRequest("Ne postoji dati fajl.");
            }

            string[] files = Directory.GetFiles(SelectedPath).Select(Path.GetFileName).ToArray();

            string SelectedPaths = Path.Combine(CurrentPath, "Users", "publicDatasets", name, fileName);

            var csvTable = new DataTable();
            using (var csvReader = new LumenWorks.Framework.IO.Csv.CsvReader(new StreamReader(System.IO.File.OpenRead(SelectedPaths)), true))
            {
                csvTable.Load(csvReader);
            }
            string result = string.Empty;
            result = JsonConvert.SerializeObject(csvTable);

            var resultjson = System.Text.Json.JsonSerializer.Deserialize<JsonDocument>(result); //json

            var data = new StringContent(result, System.Text.Encoding.UTF8, "application/json");
            //var url = "http://127.0.0.1:3000/csv";
            var csvurl = url + "/csv";
            var response = await http.PostAsync(csvurl, data);

            Name = name;
            return Ok(resultjson);
        }

        [HttpPost("savedModels")] //Vracanje imena sacuvanih Modela.
        public async Task<ActionResult<String>> PostSavedModels(String name, string Username)
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
        public async Task<ActionResult<JsonDocument>> PostSelectedModel(String name, string Username)
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
        public async Task<ActionResult<JsonDocument>> PostModelForCompare(String dirname, String modelname, string Username)
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
            CsvConfiguration csvConfiguration = new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                HasHeaderRecord = true,
                Delimiter = ",",
                MissingFieldFound = null
            };
            CsvHelper.CsvReader csv = new CsvHelper.CsvReader(System.IO.File.OpenText(SelectedPath), csvConfiguration);
            csv.Read();
            csv.ReadHeader();

            List<string> headers = csv.HeaderRecord.ToList();
            System.Data.DataTable dataTable = new System.Data.DataTable();
            foreach (string header in headers)
            {
                dataTable.Columns.Add(new System.Data.DataColumn(header));
                //Console.WriteLine(header);
            }

            while (csv.Read())
            {
                System.Data.DataRow row = dataTable.NewRow();

                foreach (System.Data.DataColumn column in dataTable.Columns)
                {
                    row[column.ColumnName] = csv.GetField(column.DataType, column.ColumnName);
                    //Console.WriteLine(column.ColumnName);
                }      

                dataTable.Rows.Add(row);
            }

            /*for(int i = 0; i < headers.Count; i++) //ovako bi trebalo i radilo bi i za regresione i klasifikacione modele ali nesto nece
            {
                string header = headers[i];
                //List<string> header = new List<string>(dataTable.Rows.Count);
            }*/

            if (headers.Contains("MAE")) //regresioni model
            {

                List<string> Loss1 = new List<string>(dataTable.Rows.Count);
                List<string> MAE1 = new List<string>(dataTable.Rows.Count);
                List<string> MSE1 = new List<string>(dataTable.Rows.Count);
                List<string> RMSE1 = new List<string>(dataTable.Rows.Count);
                List<string> label1 = new List<string>(dataTable.Rows.Count);
                List<string> pred1 = new List<string>(dataTable.Rows.Count);
                List<string> valLoss1 = new List<string>(dataTable.Rows.Count);
                List<string> valMAE1 = new List<string>(dataTable.Rows.Count);
                List<string> valMSE1 = new List<string>(dataTable.Rows.Count);
                List<string> valRMSE1 = new List<string>(dataTable.Rows.Count);
                /*List<string> evaluate = new List<string>(dataTable.Rows.Count);
                List<string> evaluate_mae1 = new List<string>(dataTable.Rows.Count);
                List<string> evaluate_mse1 = new List<string>(dataTable.Rows.Count);
                List<string> evaluate_root1 = new List<string>(dataTable.Rows.Count);*/

                foreach (DataRow row in dataTable.Rows)
                {
                    Loss1.Add((string)row["Loss"]);
                    label1.Add((string)row["label"]);
                    pred1.Add((string)row["pred"]);
                    valLoss1.Add((string)row["valLoss"]);
                    MAE1.Add((string)row["MAE"]);
                    MSE1.Add((string)row["MSE"]);
                    RMSE1.Add((string)row["RMSE"]);
                    valMAE1.Add((string)row["valMAE"]);
                    valMSE1.Add((string)row["valMSE"]);
                    valRMSE1.Add((string)row["valRMSE"]);
                    /*evaluate.Add((string)row["evaluate"]);
                    evaluate_mae1.Add((string)row["Column1"]);
                    evaluate_mse1.Add((string)row["Column2"]);
                    evaluate_root1.Add((string)row["Column3"]);*/
                }
                Loss1.RemoveAll(s => s == "");
                label1.RemoveAll(s => s == "");
                pred1.RemoveAll(s => s == "");
                valLoss1.RemoveAll(s => s == "");
                MAE1.RemoveAll(s => s == "");
                MSE1.RemoveAll(s => s == "");
                RMSE1.RemoveAll(s => s == "");
                valMAE1.RemoveAll(s => s == "");
                valMSE1.RemoveAll(s => s == "");
                valRMSE1.RemoveAll(s => s == "");
                /*evaluate.RemoveAll(s => s == "");
                evaluate.RemoveAll(s => s == "loss");
                evaluate_mae1.RemoveAll(s => s == "");
                evaluate_mae1.RemoveAll(s => s == "mae");
                evaluate_mse1.RemoveAll(s => s == "");
                evaluate_mse1.RemoveAll(s => s == "mse");
                evaluate_root1.RemoveAll(s => s == "");
                evaluate_root1.RemoveAll(s => s == "root_mean_squared_error");*/
                var regmodel = new
                {
                    Loss = Loss1,
                    label = label1,
                    pred = pred1,
                    valLoss = valLoss1,
                    MAE = MAE1,
                    MSE = MSE1,
                    RMSE = RMSE1,
                    valMAE = valMAE1,
                    valMSE = valMSE1,
                    valRMSE = valRMSE1,
                    /*evaluate_loss = evaluate,
                    evaluate_mae = evaluate_mae1,
                    evaluate_mse = evaluate_mse1,
                    root_mean_squared_error = evaluate_root1*/
                };
                return Ok(regmodel);
            }
            if (headers.Contains("AUC")) //klasifikacioni model
            {

                List<string> Loss1 = new List<string>(dataTable.Rows.Count);
                List<string> AUC1 = new List<string>(dataTable.Rows.Count);
                List<string> Accuracy1 = new List<string>(dataTable.Rows.Count);
                List<string> F1_score1 = new List<string>(dataTable.Rows.Count);
                List<string> label1 = new List<string>(dataTable.Rows.Count);
                List<string> pred1 = new List<string>(dataTable.Rows.Count);
                List<string> Precision1 = new List<string>(dataTable.Rows.Count);
                List<string> Recall1 = new List<string>(dataTable.Rows.Count);
                List<string> valAUC1 = new List<string>(dataTable.Rows.Count);
                List<string> valAccuracy1 = new List<string>(dataTable.Rows.Count);
                List<string> valF1_score1 = new List<string>(dataTable.Rows.Count);
                List<string> valPrecision1 = new List<string>(dataTable.Rows.Count);
                List<string> valRecall1 = new List<string>(dataTable.Rows.Count);
                List<string> valLoss1 = new List<string>(dataTable.Rows.Count);
                foreach (DataRow row in dataTable.Rows)
                {
                    Loss1.Add((string)row["Loss"]);
                    label1.Add((string)row["label"]);
                    pred1.Add((string)row["pred"]);
                    valLoss1.Add((string)row["valLoss"]);
                    AUC1.Add((string)row["AUC"]);
                    Accuracy1.Add((string)row["Accuracy"]);
                    F1_score1.Add((string)row["F1_score"]);
                    Precision1.Add((string)row["Precision"]);
                    Recall1.Add((string)row["Recall"]);
                    valAUC1.Add((string)row["valAUC"]);
                    valAccuracy1.Add((string)row["valAccuracy"]);
                    valF1_score1.Add((string)row["valF1_score"]);
                    valPrecision1.Add((string)row["valPrecision"]);
                    valRecall1.Add((string)row["valRecall"]);
                }
                Loss1.RemoveAll(s => s == "");
                label1.RemoveAll(s => s == "");
                pred1.RemoveAll(s => s == "");
                valLoss1.RemoveAll(s => s == "");
                AUC1.RemoveAll(s => s == "");
                Accuracy1.RemoveAll(s => s == "");
                F1_score1.RemoveAll(s => s == "");
                Precision1.RemoveAll(s => s == "");
                Recall1.RemoveAll(s => s == "");
                valAUC1.RemoveAll(s => s == "");
                valAccuracy1.RemoveAll(s => s == "");
                valF1_score1.RemoveAll(s => s == "");
                valPrecision1.RemoveAll(s => s == "");
                valRecall1.RemoveAll(s => s == "");

                var classmodel = new
                {
                    Loss = Loss1,
                    label = label1,
                    pred = pred1,
                    valLoss = valLoss1,
                    AUC = AUC1,
                    Accuracy = Accuracy1,
                    F1_score = F1_score1,
                    Precision = Precision1,
                    Recall = Recall1,
                    valAUC = valAUC1,
                    valAccuracy = valAccuracy1,
                    valF1_score = valF1_score1,
                    valPrecision = valPrecision1,
                    valRecall = valRecall1,
                };
                return Ok(classmodel);
            }
            string result21 = string.Empty;
            result21 = JsonConvert.SerializeObject(dataTable);

            var resultjson21 = System.Text.Json.JsonSerializer.Deserialize<JsonDocument>(result21);
            return resultjson;
        }

        [HttpPost("publicModels")] //Vracanje vrednosti izabranog javnog modela kako bi mogle da se prikazu na grafiku i uporede.
        public async Task<ActionResult<JsonDocument>> PostPublicModels(String userName, String modelname) //username je FromCsv a modelname je name
        {
            string CurrentPath = Directory.GetCurrentDirectory();
            string publicFolder = modelname + "(" + userName + ")";
            string fileName = modelname + "(" + userName + ")" + ".csv";
            string SelectedPath = Path.Combine(CurrentPath, "Users", "publicProblems", publicFolder, fileName);

            if (!System.IO.File.Exists(SelectedPath))
            {
                return BadRequest("Ne postoji dati model. " + SelectedPath);
            }

            var modelTable = new DataTable();
            using (var csvReader = new LumenWorks.Framework.IO.Csv.CsvReader(new StreamReader(System.IO.File.OpenRead(SelectedPath)), true))
            {
                modelTable.Load(csvReader);
            }
            string result = string.Empty;
            result = JsonConvert.SerializeObject(modelTable);

            var resultjson = System.Text.Json.JsonSerializer.Deserialize<JsonDocument>(result);
            CsvConfiguration csvConfiguration = new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                HasHeaderRecord = true,
                Delimiter = ",",
                MissingFieldFound = null
            };
            CsvHelper.CsvReader csv = new CsvHelper.CsvReader(System.IO.File.OpenText(SelectedPath), csvConfiguration);
            csv.Read();
            csv.ReadHeader();

            List<string> headers = csv.HeaderRecord.ToList();
            System.Data.DataTable dataTable = new System.Data.DataTable();
            foreach (string header in headers)
            {
                dataTable.Columns.Add(new System.Data.DataColumn(header));
            }

            while (csv.Read())
            {
                System.Data.DataRow row = dataTable.NewRow();

                foreach (System.Data.DataColumn column in dataTable.Columns)
                {
                    row[column.ColumnName] = csv.GetField(column.DataType, column.ColumnName);
                }

                dataTable.Rows.Add(row);
            }

            if (headers.Contains("MAE")) //regresioni model
            {

                List<string> Loss1 = new List<string>(dataTable.Rows.Count);
                List<string> MAE1 = new List<string>(dataTable.Rows.Count);
                List<string> MSE1 = new List<string>(dataTable.Rows.Count);
                List<string> RMSE1 = new List<string>(dataTable.Rows.Count);
                List<string> label1 = new List<string>(dataTable.Rows.Count);
                List<string> pred1 = new List<string>(dataTable.Rows.Count);
                List<string> valLoss1 = new List<string>(dataTable.Rows.Count);
                List<string> valMAE1 = new List<string>(dataTable.Rows.Count);
                List<string> valMSE1 = new List<string>(dataTable.Rows.Count);
                List<string> valRMSE1 = new List<string>(dataTable.Rows.Count);

                foreach (DataRow row in dataTable.Rows)
                {
                    Loss1.Add((string)row["Loss"]);
                    label1.Add((string)row["label"]);
                    pred1.Add((string)row["pred"]);
                    valLoss1.Add((string)row["valLoss"]);
                    MAE1.Add((string)row["MAE"]);
                    MSE1.Add((string)row["MSE"]);
                    RMSE1.Add((string)row["RMSE"]);
                    valMAE1.Add((string)row["valMAE"]);
                    valMSE1.Add((string)row["valMSE"]);
                    valRMSE1.Add((string)row["valRMSE"]);
                }
                Loss1.RemoveAll(s => s == "");
                label1.RemoveAll(s => s == "");
                pred1.RemoveAll(s => s == "");
                valLoss1.RemoveAll(s => s == "");
                MAE1.RemoveAll(s => s == "");
                MSE1.RemoveAll(s => s == "");
                RMSE1.RemoveAll(s => s == "");
                valMAE1.RemoveAll(s => s == "");
                valMSE1.RemoveAll(s => s == "");
                valRMSE1.RemoveAll(s => s == "");
                var regmodel = new
                {
                    Loss = Loss1,
                    label = label1,
                    pred = pred1,
                    valLoss = valLoss1,
                    MAE = MAE1,
                    MSE = MSE1,
                    RMSE = RMSE1,
                    valMAE = valMAE1,
                    valMSE = valMSE1,
                    valRMSE = valRMSE1,
                };
                return Ok(regmodel);
            }
            if (headers.Contains("AUC")) //klasifikacioni model
            {

                List<string> Loss1 = new List<string>(dataTable.Rows.Count);
                List<string> AUC1 = new List<string>(dataTable.Rows.Count);
                List<string> Accuracy1 = new List<string>(dataTable.Rows.Count);
                List<string> F1_score1 = new List<string>(dataTable.Rows.Count);
                List<string> label1 = new List<string>(dataTable.Rows.Count);
                List<string> pred1 = new List<string>(dataTable.Rows.Count);
                List<string> Precision1 = new List<string>(dataTable.Rows.Count);
                List<string> Recall1 = new List<string>(dataTable.Rows.Count);
                List<string> valAUC1 = new List<string>(dataTable.Rows.Count);
                List<string> valAccuracy1 = new List<string>(dataTable.Rows.Count);
                List<string> valF1_score1 = new List<string>(dataTable.Rows.Count);
                List<string> valPrecision1 = new List<string>(dataTable.Rows.Count);
                List<string> valRecall1 = new List<string>(dataTable.Rows.Count);
                List<string> valLoss1 = new List<string>(dataTable.Rows.Count);
                foreach (DataRow row in dataTable.Rows)
                {
                    Loss1.Add((string)row["Loss"]);
                    label1.Add((string)row["label"]);
                    pred1.Add((string)row["pred"]);
                    valLoss1.Add((string)row["valLoss"]);
                    AUC1.Add((string)row["AUC"]);
                    Accuracy1.Add((string)row["Accuracy"]);
                    F1_score1.Add((string)row["F1_score"]);
                    Precision1.Add((string)row["Precision"]);
                    Recall1.Add((string)row["Recall"]);
                    valAUC1.Add((string)row["valAUC"]);
                    valAccuracy1.Add((string)row["valAccuracy"]);
                    valF1_score1.Add((string)row["valF1_score"]);
                    valPrecision1.Add((string)row["valPrecision"]);
                    valRecall1.Add((string)row["valRecall"]);
                }
                Loss1.RemoveAll(s => s == "");
                label1.RemoveAll(s => s == "");
                pred1.RemoveAll(s => s == "");
                valLoss1.RemoveAll(s => s == "");
                AUC1.RemoveAll(s => s == "");
                Accuracy1.RemoveAll(s => s == "");
                F1_score1.RemoveAll(s => s == "");
                Precision1.RemoveAll(s => s == "");
                Recall1.RemoveAll(s => s == "");
                valAUC1.RemoveAll(s => s == "");
                valAccuracy1.RemoveAll(s => s == "");
                valF1_score1.RemoveAll(s => s == "");
                valPrecision1.RemoveAll(s => s == "");
                valRecall1.RemoveAll(s => s == "");

                var classmodel = new
                {
                    Loss = Loss1,
                    label = label1,
                    pred = pred1,
                    valLoss = valLoss1,
                    AUC = AUC1,
                    Accuracy = Accuracy1,
                    F1_score = F1_score1,
                    Precision = Precision1,
                    Recall = Recall1,
                    valAUC = valAUC1,
                    valAccuracy = valAccuracy1,
                    valF1_score = valF1_score1,
                    valPrecision = valPrecision1,
                    valRecall = valRecall1,
                };
                return Ok(classmodel);
            }
            string result21 = string.Empty;
            result21 = JsonConvert.SerializeObject(dataTable);

            var resultjson21 = System.Text.Json.JsonSerializer.Deserialize<JsonDocument>(result21);
            return resultjson;
        }

        [HttpPost("save")] //pravljenje foldera gde ce se cuvati model cuva se model samo kad korisnik klikne na dugme sacuvaj model kao i cuvanje povratne vrednosti modela
        public async Task<ActionResult> PostSave(String modelNames, Boolean publicModel, string Username, string upgradedName) //Ime modela kako korisnik zeli da ga cuva i da li zeli da bude javan model
        {                                                                                                                      //Poslati i ime csv fajla sa kojim je treniran model kako bi sacuvali u pravom folderu
            var userNu = 0;
            if (Username != null)
            {
                var data = new StringContent(Username, System.Text.Encoding.UTF8, "application/text");
                var urluser = url + "/username";
                var response = await http.PostAsync(urluser, data);
                for (int i = 0; i < dict_save.Count; i++)
                {
                    if (dict_save.ElementAt(i).Key == Username)
                    {
                        userNu = i;
                    }
                }
                string CurrentPath = Directory.GetCurrentDirectory();
                string path = Path.Combine(CurrentPath, "Users", Username, upgradedName);
                string modeldirname = Path.Combine(CurrentPath, "Users", Username, upgradedName, modelNames);
                string csvFolder = Path.Combine(CurrentPath, "Users", Username, upgradedName);

                if (System.IO.Directory.Exists(csvFolder))
                {
                    if (System.IO.Directory.Exists(modeldirname))
                    {
                        return Ok("Vec postoji model sa tim imenom.");
                    }
                    else
                    {
                        System.IO.Directory.CreateDirectory(modeldirname);
                        if (publicModel)
                        {
                            string publicName1 = modelNames + "(" + Username + ")";
                            string publicPath = Path.Combine(CurrentPath, "Users", "publicProblems", publicName1);
                            System.IO.Directory.CreateDirectory(publicPath);
                        }
                        Console.WriteLine("Directory for new Model created successfully!");
                    }
                }
                else
                {
                    System.IO.Directory.CreateDirectory(modeldirname);

                    //treba sacuvati i csv ovde
                    string publicDataset = Path.Combine(CurrentPath, "Users", "publicDatasets", upgradedName, upgradedName + ".csv"); //javni dataset
                    string destFile = Path.Combine(CurrentPath, "Users", Username, upgradedName, upgradedName + "csv.csv");
                    System.IO.File.Copy(publicDataset, destFile, true);

                    if (publicModel)
                    {
                        string publicName1 = modelNames + "(" + Username + ")";
                        string publicPath = Path.Combine(CurrentPath, "Users", "publicProblems", publicName1);
                        System.IO.Directory.CreateDirectory(publicPath);
                    }
                    Console.WriteLine("Directory for new Model created successfully!");
                }
                string saljemPath = Path.Combine(CurrentPath, "Users", Username, upgradedName, modelNames);
                var pathjson = System.Text.Json.JsonSerializer.Serialize(saljemPath);
                var pathdata = new StringContent(saljemPath, System.Text.Encoding.UTF8, "application/json");
                var pathurl = url + "/savemodel";
                var pathresponse = await http.PostAsync(pathurl, pathdata);


                string hpName = "deletemeHP.csv";
                string path1 = Path.Combine(CurrentPath, "Users", Username, upgradedName, modelNames);
                string pathToCreateHP = System.IO.Path.Combine(path1, hpName);


                var workbookhp = new Workbook();
                var worksheethp = workbookhp.Worksheets[0];
                var layoutOptionshp = new JsonLayoutOptions();
                layoutOptionshp.ArrayAsTable = true;
                JsonUtility.ImportData(dict_save.ElementAt(userNu).Value.hiperj, worksheethp.Cells, 0, 0, layoutOptionshp);


                var workbook = new Workbook();
                var worksheet = workbook.Worksheets[0];
                var layoutOptions = new JsonLayoutOptions();
                layoutOptions.ArrayAsTable = true;
                JsonUtility.ImportData(dict_save.ElementAt(userNu).Value.modelsave, worksheet.Cells, 0, 0, layoutOptions);

                string modelName = "deleteme.csv";
                string pathToCreate = System.IO.Path.Combine(path, modelNames, modelName);

                workbook.Save(pathToCreate, SaveFormat.CSV); //cuvanje modela
                workbookhp.Save(pathToCreateHP, SaveFormat.CSV); //cuvanje hiperparametara

                List<String> lines = new List<string>();
                string line;
                System.IO.StreamReader file = new System.IO.StreamReader(pathToCreate);

                while ((line = file.ReadLine()) != null)
                {
                    lines.Add(line);
                }

                lines.RemoveAll(l => l.Contains("Evaluation Only."));

                List<String> lines1 = new List<string>();
                string line1;
                System.IO.StreamReader file1 = new System.IO.StreamReader(pathToCreateHP);

                while ((line1 = file1.ReadLine()) != null)
                {
                    lines1.Add(line1);
                }

                lines1.RemoveAll(l1 => l1.Contains("Evaluation Only."));

                string model = modelNames + ".csv";
                string publicName = modelNames + "(" + Username + ")";
                string pblmod = publicName + ".csv";
                string pathToCreate12 = System.IO.Path.Combine(modeldirname, model);
                string publicPathModel = Path.Combine(CurrentPath, "Users", "publicProblems", publicName, pblmod);
                using (System.IO.StreamWriter outfile = new System.IO.StreamWriter(pathToCreate12))
                {
                    outfile.Write(String.Join(System.Environment.NewLine, lines.ToArray()));
                }

                string hp1 = modelNames + "HP.csv";
                string pathToCreatehp = Path.Combine(CurrentPath, "Users", Username, upgradedName, modelNames, hp1);

                using (System.IO.StreamWriter outfile1 = new System.IO.StreamWriter(pathToCreatehp))
                {
                    outfile1.Write(String.Join(System.Environment.NewLine, lines1.ToArray()));
                }

                if (publicModel)
                {
                    using (System.IO.StreamWriter outfile = new System.IO.StreamWriter(publicPathModel))
                    {
                        outfile.Write(String.Join(System.Environment.NewLine, lines.ToArray()));
                    }


                    string pblhp = publicName + "HP.csv";
                    string publicPathHp = Path.Combine(CurrentPath, "Users", "publicProblems", publicName, pblhp);
                    using (System.IO.StreamWriter outfile1 = new System.IO.StreamWriter(publicPathHp))
                    {
                        outfile1.Write(String.Join(System.Environment.NewLine, lines1.ToArray()));
                    }
                    file1.Close();
                }
                
                string path2 = System.IO.Path.Combine(CurrentPath, "Users", Username, upgradedName);
                string names = "deleteme.csv";
                string pathToDelete = System.IO.Path.Combine(path2, names);
                file.Close();
                if (System.IO.File.Exists(pathToCreate))
                {
                    System.IO.File.Delete(pathToCreate);
                }
                file1.Close();
                if (System.IO.File.Exists(pathToCreateHP))
                {
                    System.IO.File.Delete(pathToCreateHP);
                }
                
                return Ok(modeldirname);
            }
            else
                return Ok("Korisnik nije ulogovan.");
        }

        [HttpPost("hpNeprijavljen")] //Slanje HP na pajton za neprijavljenog korisnika
        public async Task<ActionResult<Hiperparametri>> PostHp([FromBody] Hiperparametri hiper, string Username, string CsvFile) //treba poslati i ime csv fajla koji je izabran
        {
            SaveData sd = new SaveData();
            if (Username == null || Username == "null")
            {
                hiper.Username = "unknown";
                hp = hiper;
                var hiperjson = System.Text.Json.JsonSerializer.Serialize(hiper);
                hiperJ = hiperjson;
                var data = new StringContent(hiperjson, System.Text.Encoding.UTF8, "application/json");
                //var url = "http://127.0.0.1:3000/hp";
                var hpurl = url + "/hp";
                var response = await http.PostAsync(hpurl, data);

                if (CsvFile == "realestate")
                {
                    var loadedCsv = await _context.Realestate.ToListAsync(); //lista/json
                    string jsoncsv = JsonSerializer.Serialize(loadedCsv); //string
                    string csve = jsoncsv;
                    var datareg = new StringContent(csve, System.Text.Encoding.UTF8, "application/json");
                    var urlcsv = url + "/csv";
                    var responsereg = await http.PostAsync(urlcsv, datareg);
                }
                if (CsvFile == "mpg")
                {
                    var loadedCsv = await _context.Mpg.ToListAsync(); //lista/json
                    string jsoncsv = JsonSerializer.Serialize(loadedCsv); //string
                    string csve = jsoncsv;
                    var dataclass = new StringContent(csve, System.Text.Encoding.UTF8, "application/json");
                    var urlcsv = url + "/csv";
                    var responseclass = await http.PostAsync(urlcsv, dataclass);
                }
            }
            else
            {
                hiper.Username = Username;
                hp = hiper;
                var hiperjson = System.Text.Json.JsonSerializer.Serialize(hiper);
                hiperJ = hiperjson;
                var data = new StringContent(hiperjson, System.Text.Encoding.UTF8, "application/json");
                //var url = "http://127.0.0.1:3000/hp";
                var hpurl = url + "/hp";
                var response = await http.PostAsync(hpurl, data);

                //                                                                                  hiperparametri                                                                                
                //---------------------------------------------------------------------------------------------------
                //                                                                                  CsvFile

                //proveriti da li se fajl sa prosledjenim imenom nalazi u privatnim ili javnim datasetovima, primat imaju privatni

                string fileName = CsvFile + ".csv";
                string CurrentPath = Directory.GetCurrentDirectory();
                string privatePath = Path.Combine(CurrentPath, "Users", Username, CsvFile, fileName);
                string publicPath = Path.Combine(CurrentPath, "Users", "publicDatasets", CsvFile, fileName);

                if (System.IO.File.Exists(privatePath))
                {
                    var csvTable = new DataTable();
                    using (var csvReader = new LumenWorks.Framework.IO.Csv.CsvReader(new StreamReader(System.IO.File.OpenRead(privatePath)), true))
                    {
                        csvTable.Load(csvReader);
                    }
                    string result = string.Empty;
                    result = JsonConvert.SerializeObject(csvTable);

                    var resultjson = System.Text.Json.JsonSerializer.Deserialize<JsonDocument>(result);

                    var datacsv = new StringContent(result, System.Text.Encoding.UTF8, "application/json");
                    var csvurl = url + "/csv";
                    var responsecsv = await http.PostAsync(csvurl, datacsv);
                }
                else
                {
                    var csvTable = new DataTable();
                    using (var csvReader = new LumenWorks.Framework.IO.Csv.CsvReader(new StreamReader(System.IO.File.OpenRead(publicPath)), true))
                    {
                        csvTable.Load(csvReader);
                    }
                    string result = string.Empty;
                    result = JsonConvert.SerializeObject(csvTable);

                    var resultjson = System.Text.Json.JsonSerializer.Deserialize<JsonDocument>(result);

                    var datacsv = new StringContent(result, System.Text.Encoding.UTF8, "application/json");
                    var csvurl = url + "/csv";
                    var responsecsv = await http.PostAsync(csvurl, datacsv);
                }
                sd.hiperj = hiperjson;
            }
            //---------------------------------------------------------------------------------------------------
            //                                                                                  model
            var modelurl = url + "/model";
            HttpResponseMessage httpResponse = await http.GetAsync(modelurl);
            var model = System.Text.Json.JsonSerializer.Deserialize<JsonDocument>(await httpResponse.Content.ReadAsStringAsync());
            var dataModel = await httpResponse.Content.ReadAsStringAsync();
            modelSave = dataModel;

            /*Console.WriteLine("\nDATAMODEL\n");
            Console.WriteLine(dataModel);*/

            sd.modelsave = dataModel;

            var br = 0;
            for (int i = 0; i < dict_save.Count; i++)
            {
                if(dict_save.ElementAt(i).Key == Username)
                {
                    dict_save[Username] = sd; //ako je korisnik ranije vec trenirao model zameniti vrednosti od proslog sacuvanog modela sa novim
                    br = 1;
                }
            }
            if(br == 0)
                dict_save.Add(Username, sd); //ako korisnik prvi put hoce da sacuva model ubaciti vrednosti njegovog modela pored njegovog imena

            return Ok(model);
        }

        [HttpPost("csv")] //Slanje CSV na pajton
        [DisableRequestSizeLimit]
        //[Obsolete]
        public async Task<ActionResult<DataLoad>> PostCsv([FromBody] DataLoad cs, Boolean publicData, string Username)
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
            //var upgradedName = name.Substring(0, name.Length - 4);
            //string path = currentPath + @"\Users\" + Username + "\\" + upgradedName;

            string pathToCreate = "";
            if (Username != null)
            {
                string path = System.IO.Path.Combine(currentPath, "Users", Username, name);
                string publicPath = System.IO.Path.Combine(currentPath, "Users", "publicDatasets", name);
                string publicName = name + ".csv";
                string publicCreate = System.IO.Path.Combine(publicPath, publicName);
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
                    string names = name + "1" + ".csv";
                    pathToCreate = System.IO.Path.Combine(path, names);

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

                    string pathToCreate12 = System.IO.Path.Combine(path, name + ".csv");
                    using (System.IO.StreamWriter outfile = new System.IO.StreamWriter(pathToCreate12))
                    {
                        outfile.Write(String.Join(System.Environment.NewLine, lines.ToArray()));
                    }

                    if (publicData)
                    {
                        if (Directory.Exists(publicPath))
                            Console.WriteLine("There is already public dataset with that name.");
                        else
                        {
                            System.IO.Directory.CreateDirectory(publicPath);
                            Console.WriteLine("Directory for '{0}' created successfully!", name);
                            //cuvanje dataseta na putanji publicPath i kreirati folder po imenu csv-a?
                            using (System.IO.StreamWriter outfile = new System.IO.StreamWriter(publicCreate))
                            {
                                outfile.Write(String.Join(System.Environment.NewLine, lines.ToArray()));
                            }
                        }
                    }
                    file.Close();
                    System.IO.File.Delete(pathToCreate);
                    /*string CurrentPath = Directory.GetCurrentDirectory();
                    string SelectedPath = System.IO.Path.Combine(CurrentPath, "Users", Username);
                    string[] subdirs = Directory.GetDirectories(SelectedPath).Select(Path.GetFileName).ToArray();
                    for(int i = 0; i < subdirs.Length; i++)
                        Console.WriteLine(subdirs[i]);*/
                }
            }
            else
                Console.WriteLine("Niste ulogovani.");

            //System.IO.File.Delete(pathToCreate);
            return Ok(stat);
        }

        //za prediktovanje csv-a preko modela
        [HttpPost("predictionModel")] //Slanje Putanje do foldera gde je sacuvan izabrani model na /pathModel bi mogao
                                      //Slanje originalnog CSV-a sa kojim je kreiran model na /csv mozda postoji i /predictionCsvOriginal 
                                      //Slanje hiperparametara sa kojima je kreiran izabrani model na /hp mozda postoji i /predictionHp 
                                      //Slanje novog csv-a ucitanog da se prediktuje na /predictionCsv
        public async Task<ActionResult<JsonDocument>> PostPredictedModel([FromBody] DataLoad cs, String dirname, String modelname, string Username)
        {
            string CurrentPath = Directory.GetCurrentDirectory();
            string fileName = modelname + ".csv"; //rezultati modela koji su sacuvani u csv fajlu
            string SelectedPath = Path.Combine(CurrentPath, "Users", Username, dirname, modelname, fileName); //putanja do modela

            string csvName = dirname + ".csv"; //csv iz kojeg je kreiran model
            string csvPath = Path.Combine(CurrentPath, "Users", Username, dirname, csvName); //putanja do csv-a

            if (!System.IO.File.Exists(csvPath))
            {
                csvName = dirname + "csv.csv";
                csvPath = Path.Combine(CurrentPath, "Users", Username, dirname, csvName);
            }

            string hpName = modelname + "HP.csv"; //hiperparametri korisceni za kreiranje izabranog modela
            string hpPath = Path.Combine(CurrentPath, "Users", Username, dirname, modelname, hpName); //putanja do hiperparametara

            if (!System.IO.File.Exists(csvPath)) //dal postoji taj csv
            {
                return BadRequest("Ne postoji dati model. " + SelectedPath);
            }
            else if (Username == null)
            {
                return BadRequest("Niste ulogovani.");
            }

            string modelPath = Path.Combine(CurrentPath, "Users", Username, dirname, modelname); //putanja do foldera gde je model
            var datamodel = new StringContent(modelPath, System.Text.Encoding.UTF8, "application/json");
            var modelurl = url + "/pathModel";
            var responsemodel = await http.PostAsync(modelurl, datamodel);

            //CSV IZ KOJEG JE KREIRAN MODEL
            var csvTable = new DataTable();
            using (var csvReader = new LumenWorks.Framework.IO.Csv.CsvReader(new StreamReader(System.IO.File.OpenRead(csvPath)), true))
            {
                csvTable.Load(csvReader);
            }
            string resultCSV = string.Empty;
            resultCSV = JsonConvert.SerializeObject(csvTable);

            var resultjsoncsv = System.Text.Json.JsonSerializer.Deserialize<JsonDocument>(resultCSV); //rezultati csv-a to treba poslati na /csv
            var datacsv = new StringContent(resultCSV, System.Text.Encoding.UTF8, "application/json");
            //var csvurl = url + "/csv";
            var csvurl = url + "/predictionCsvOriginal";
            var responsecsv = await http.PostAsync(csvurl, datacsv);

            //HIPERPARAMETRI SA KOJIMA JE KREIAN MODEL
            var hpTable = new DataTable();
            using (var csvReader = new LumenWorks.Framework.IO.Csv.CsvReader(new StreamReader(System.IO.File.OpenRead(hpPath)), true))
            {
                hpTable.Load(csvReader);
            }
            string resultHP = string.Empty;
            resultHP = JsonConvert.SerializeObject(hpTable); // da li ovde izvuci samo nizove i delove koji trebaju za predikciju ili sve?

            var resultjsonhp = System.Text.Json.JsonSerializer.Deserialize<JsonDocument>(resultHP); //rezultati HP to treba poslati na /hp
            var datahp = new StringContent(resultHP, System.Text.Encoding.UTF8, "application/json");
            //var hpurl = url + "/hp";
            var hpurl = url + "/predictionHp"; 
            var responsehp = await http.PostAsync(hpurl, datahp);


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

            return Ok(resultjsonhp);
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
