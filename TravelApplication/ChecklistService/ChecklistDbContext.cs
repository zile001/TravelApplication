using ChecklistService.Models;
using Microsoft.EntityFrameworkCore;

namespace ChecklistService
{
    public class ChecklistDbContext : DbContext
    {
        public ChecklistDbContext(DbContextOptions<ChecklistDbContext> options) : base(options)
        {
        }
        public DbSet<ChecklistItem> ChecklistItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ChecklistItem>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(150);
                entity.Property(e => e.Category).HasMaxLength(50).HasDefaultValue("Opšte");
                entity.Property(e => e.IsPacked).HasDefaultValue(false);
            });
        }
    }
}
