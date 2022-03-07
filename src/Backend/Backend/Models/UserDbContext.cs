using Microsoft.EntityFrameworkCore;

namespace Backend.Models
{
    public class UserDbContext : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite(@"Data source=C:\Users\laraa\Desktop\revolutionn\src\Backend\Database\RevolutionnDB.db");
        }

        public DbSet<UserDto> Users { get; set; }
    }
}
