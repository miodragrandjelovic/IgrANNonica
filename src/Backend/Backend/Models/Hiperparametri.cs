using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Hiperparametri
    {
        public string EncodingType { get; set; } = string.Empty;
        public float LearningRate { get; set; }
        public string Activation { get; set; } = string.Empty;
        public int Epoch { get; set; }
        public string Regularization { get; set; } = string.Empty;
        public float RegularizationRate { get; set; }
        public string ProblemType { get; set; } = string.Empty;
        public int Layers { get; set; }
        public int NeuronsLvl1 { get; set; }
        public int NeuronsLvl2 { get; set; }
        public int NeuronsLvl3 { get; set; }
        public int NeuronsLvl4 { get; set; }
        public int NeuronsLvl5 { get; set; }
        public int NeuronsLvl6 { get; set; }
        public int NeuronsLvl7 { get; set; }
        public string Activation1 { get; set; } = string.Empty;
        public string Activation2 { get; set; } = string.Empty;
        public string Activation3 { get; set; } = string.Empty;
        public string Activation4 { get; set; } = string.Empty;
        public string Activation5 { get; set; } = string.Empty;
        public string Activation6 { get; set; } = string.Empty;
        public string Activation7 { get; set; } = string.Empty;

        public List<string> ColumNames { get; set; }
        public List<string> Encodings { get; set; }
        public List<string> CatNum { get; set; }

        public int Ratio { get; set; }
        public int BatchSize { get; set; }

        public bool Randomize { get; set; }


        public string Inputs { get; set; } = string.Empty;
        public string Output { get; set; } = string.Empty;

        public string Username { get; set; } = string.Empty;   

    }
}
