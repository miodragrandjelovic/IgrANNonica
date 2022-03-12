using Microsoft.EntityFrameworkCore;

namespace Backend.Models
{
    public class UserDbContext : DbContext
    {      
        public UserDbContext(DbContextOptions<UserDbContext> options) : base(options){ }
        /*
        protected readonly IConfiguration Configuration;
        public UserDbContext(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            options.UseSqlite(Configuration.GetConnectionString("ConnectionStr"));
        }*/
        public DbSet<User> RegistrovaniUseri { get; set; }
    }
}
