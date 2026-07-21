using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace FinanceService
{
    public class FinanceDbContextFactory : IDesignTimeDbContextFactory<FinanceDbContext>
    {
        public FinanceDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<FinanceDbContext>();

           
            optionsBuilder.UseSqlServer("Server=localhost\\SQLEXPRESS;Database=FinanceServiceDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True;Encrypt=False;");
            return new FinanceDbContext(optionsBuilder.Options);
        }
    }
}
