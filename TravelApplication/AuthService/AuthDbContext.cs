using Microsoft.EntityFrameworkCore;
namespace AuthService
{
    public class AuthDbContext : DbContext
    {
        public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            string adminPasswordHash = BCrypt.Net.BCrypt.HashPassword("admin");

            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1, // Fiksiran ID za seed podatke
                    Username = "admin",
                    Email = "admin@gmail.com",
                    PasswordHash = adminPasswordHash,
                    Role = UserRole.Admin
                }
            );
        }
    }
}
