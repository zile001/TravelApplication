using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace TravelService
{
    public class TravelDbContextFactory : IDesignTimeDbContextFactory<TravelDbContext>
    {
        public TravelDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<TravelDbContext>();

            // Isti connection string koji se koristi u TravelService.cs
            var connectionString = "Server=DESKTOP-LOG3VE7\\SQLEXPRESS;Database=TravelServiceDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True;";

            optionsBuilder.UseSqlServer(connectionString);

            return new TravelDbContext(optionsBuilder.Options);
        }
    }
}
