using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text;
using Backend.Models;
using System.Text.Json.Nodes;
using System.Net.Http.Json;


namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoadData : ControllerBase
    {
        private readonly HttpClient http = new HttpClient();
        public static Hiperparametri hp = new Hiperparametri();
        // POST api/<HiperparametriController>
        //[HttpPost]
        //public void Post([FromBody] string value)
        /*public ActionResult<Hiperparametri> PostHiperparametri(Hiperparametri request)
        {
            hp.EncodingType= request.EncodingType;
            hp.LearningRate = request.LearningRate;
            hp.Activation = request.Activation;
            hp.Epoch = request.Epoch;
            hp.Layers = request.Layers;
            hp.Neurons = request.Neurons;
            hp.Ratio = request.Ratio;
            hp.BatchSize = request.BatchSize;
            /*
            var data = new StringContent(hp, System.Text.Encoding.UTF8, "application/json");
            var url = "http://127.0.0.1:3000/hp";
            var response = http.PostAsync(url, data);
            return hp;
        }*/

        [HttpPost("hp")] //Slanje HP na pajton
        public async Task<ActionResult<Hiperparametri>> Post(Hiperparametri hiper)
        {
            var hiperjson = JsonSerializer.Serialize(hiper);
            var data = new StringContent(hiperjson, System.Text.Encoding.UTF8, "application/json");
            var url = "http://127.0.0.1:3000/hp";
            var response = await http.PostAsync(url, data);
            //var hiperparametars = JsonSerializer.Deserialize<Hiperparametri>(await response.Content.ReadAsStringAsync());
            return Ok(hiperjson);
        }

        [HttpPost("csv")] //Slanje CSV na pajton
        public async Task<ActionResult<DataLoad>> PostCsv([FromBody] DataLoad cs)
        {
            string csve = cs.CsvData;
            var data = new StringContent(csve, System.Text.Encoding.UTF8, "application/json");
            var url = "http://127.0.0.1:3000/csv";
            var response = await http.PostAsync(url, data);
            return Ok(csve);
        }

    }
}
