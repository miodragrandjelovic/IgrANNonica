using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Hiperparametri
    {
        public float LearningRate { get; set; }
        public int Epoch { get; set; }
        public string Regularization { get; set; } = string.Empty;
        public float RegularizationRate { get; set; }
        public string ProblemType { get; set; } = string.Empty;
        public int Layers { get; set; }
        public List<int> NumberOfNeurons { get; set; }
        public List<string> ActivationFunctions { get; set; }

        public List<string> MissingValues { get; set; }
        public List<string> ColumNames { get; set; }
        public List<string> Encodings { get; set; }
        public List<string> CatNum { get; set; }

        public int Ratio { get; set; }
        public int BatchSize { get; set; }

        public bool Randomize { get; set; }

        public int ValAndTest { get; set; }
        public string Inputs { get; set; } = string.Empty;
        public string Output { get; set; } = string.Empty;

        public string Username { get; set; } = string.Empty;   

    }
}
