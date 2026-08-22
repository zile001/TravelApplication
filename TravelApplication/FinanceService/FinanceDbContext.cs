using FinanceService.Models;
using Microsoft.EntityFrameworkCore;

namespace FinanceService
{
    public class FinanceDbContext : DbContext
    {
        public FinanceDbContext(DbContextOptions<FinanceDbContext> options) : base(options)
        {
        }

        public DbSet<Expense> Expenses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Expense>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(150);
                entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Date);
                entity.Property(e => e.Description).HasMaxLength(500);
                entity.Property(e => e.Category).HasConversion<int>(); // Čuva Enum kao int u bazi
            });
        }
    }
}
