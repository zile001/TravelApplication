using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore;

namespace ChecklistService
{
    public class ChecklistDbContextFactory : IDesignTimeDbContextFactory<ChecklistDbContext>
    {
        public ChecklistDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ChecklistDbContext>();
            optionsBuilder.UseSqlServer("Server=DESKTOP-LOG3VE7\\SQLEXPRESS;Database=ChecklistServiceDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True;Encrypt=False;");

            return new ChecklistDbContext(optionsBuilder.Options);
        }
    }
}
