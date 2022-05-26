using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Mpg
    {
        [Key]
        public int Id { get; set; }
        public string Manufacturer { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public float Displ { get; set; }
        public int Year { get; set; }
        public int Cyl { get; set; }
        public string Trans { get; set; } = string.Empty;
        public string Drv { get; set; } = string.Empty;
        public int Cty { get; set; }
        public int Hwy { get; set; }
        public string Fl { get; set; } = string.Empty;
        public string Class { get; set; } = string.Empty;

    }
}
