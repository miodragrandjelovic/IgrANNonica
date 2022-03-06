using System.ComponentModel.DataAnnotations;

namespace StudentiAPi
{
    public class Predmet
    {

        public int Id { get; set; }
        [StringLength(20)]

        public string Status { get; set; } = string.Empty;

        [StringLength(200)]
        public string Komentar { get; set; } = string.Empty;

        public int ImePredmetaId { get; set; }

        public ImePredmeta? ImePredmeta { get; set; }

    }
}
