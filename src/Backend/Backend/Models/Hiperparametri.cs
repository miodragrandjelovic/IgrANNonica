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
        public int RegularizationRate { get; set; }
        public string ProblemType { get; set; } = string.Empty;
        public int Layers { get; set; }
        public int NeuronsLvl1 { get; set; }
        public int NeuronsLvl2 { get; set; }
        public int NeuronsLvl3 { get; set; }
        public int NeuronsLvl4 { get; set; }
        public int NeuronsLvl5 { get; set; }
        public int Ratio { get; set; }
        public int BatchSize { get; set; }

        public int Randomize { get; set; }

    }
}
