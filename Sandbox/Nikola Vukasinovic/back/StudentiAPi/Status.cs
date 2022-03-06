using System.ComponentModel.DataAnnotations;

namespace StudentiAPi
{
    public class Status
    {
        public int Id{ get; set; }

        [StringLength(20)]

        public string StatusOpcija { get; set; } = string.Empty;
    }
}
