using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace projekat.Models
{
    public class RegisterDetails
    {
        [Key]
        public int RegisterId { get; set; }

        [Column(TypeName = "int")]
        public int indexNumber { get; set; }
        [Column(TypeName = "int")]
        public int yearNumber { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string fullName { get; set; }
        [Column(TypeName = "nvarchar(100)")]
        public string subjectName { get; set; }
    }
}
