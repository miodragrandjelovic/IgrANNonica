using Microsoft.EntityFrameworkCore;

namespace StudentiAPi.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet <Predmet> Predmeti { get; set; }

        public DbSet<ImePredmeta> ImenaPredmeta { get; set;}

        public DbSet<Status> Statuses { get; set; }
    }
}
