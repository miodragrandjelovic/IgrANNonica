using System.ComponentModel.DataAnnotations;
namespace Backend.Models
{
    public class Statistika
    {
        public int Count { get; set; }
        public int Unique { get; set; }
        public string Top { get; set; } = string.Empty;
        public int Freq { get; set; }
        public float Mean { get; set; }
        public float Std { get; set; }
        public float Min { get; set; }
        public float Q1 { get; set; }
        public float Q2 { get; set; }
        public float Q3 { get; set; }
        public float Max { get; set; }

    }
}
