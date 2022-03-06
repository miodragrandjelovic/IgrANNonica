using System.ComponentModel.DataAnnotations;

namespace WebApi
{
    public class Inspection
    {
        public int id { get; set; }

        [StringLength(20)]
        public string status { get; set; } = string.Empty;


        [StringLength(200)]
        public string comments { get; set; } = string.Empty;

        // ovo ce biti foreign key iz inspection type
        public int inspectionTypeId { get; set; }

        // upitnik jer je nullable / it can stay null we don't need to know
        public InspectionType? inspectionType { get; set; }


    }
}
