using System.ComponentModel.DataAnnotations;

namespace StudentiAPi
{
    public class ImePredmeta
    {
        public int Id { get; set; }
        [StringLength(20)]

        public string IPredmet { get; set; } = string.Empty;
    }
}
