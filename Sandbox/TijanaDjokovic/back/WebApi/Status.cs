using System.ComponentModel.DataAnnotations;

namespace WebApi
{
    public class Status
    {
        public int id { get; set; }

        [StringLength(20)]
        public string statusOption { get; set; } = string.Empty;


    }
}
