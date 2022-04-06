using System.ComponentModel.DataAnnotations;
namespace Backend.Models
{
    public class Realestate
    {
        [Key]
        public int No { get; set; }
        public float Transaction_date { get; set; }
        public float House_age { get; set; }
        public float Distance_MRT{ get; set; }
        public float Convenience_stores { get; set; }
        public float Latitude { get; set; }
        public float Longitude { get; set; }
        public float Unit_price { get; set; }

    }
}
