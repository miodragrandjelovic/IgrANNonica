using Microsoft.EntityFrameworkCore;

namespace projekat.Models
{
    public class RegisterDetailsContext : DbContext
    {
        public RegisterDetailsContext(DbContextOptions<RegisterDetailsContext> options):base(options)
        {

        }
        public DbSet<RegisterDetails> RegisterDetails { get; set; } //posle migracije postojace tabela koja odgovara onome iz RegisterDetails
    }
}
