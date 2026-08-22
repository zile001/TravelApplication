using Microsoft.EntityFrameworkCore;
using TravelService.Models;

namespace TravelService
{
    public class TravelDbContext : DbContext
    {
        public TravelDbContext(DbContextOptions<TravelDbContext> options) : base(options) { }

        public DbSet<TravelPlan> TravelPlans { get; set; }
        public DbSet<Destination> Destinations { get; set; }
        public DbSet<Activity> Activities { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Konfiguracija TravelPlan entiteta
            modelBuilder.Entity<TravelPlan>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Budget).HasPrecision(18, 2);

                // Relacija: 1 TravelPlan -> vise Destinations
                entity.HasMany(e => e.Destinations)
                      .WithOne()
                      .HasForeignKey(d => d.TravelPlanId)
                      .OnDelete(DeleteBehavior.Cascade);

                // Relacija: 1 TravelPlan -> vise Activities
                entity.HasMany(e => e.Activities)
                      .WithOne()
                      .HasForeignKey(a => a.TravelPlanId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Konfiguracija Destination entiteta
            modelBuilder.Entity<Destination>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(150);
            });

            // Konfiguracija Activity entiteta
            modelBuilder.Entity<Activity>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(150);
                entity.Property(e => e.EstimatedCost).HasPrecision(18, 2);

                // Konverzija Enum-a u string za lakse citanje u bazi
                entity.Property(e => e.Status)
                      .HasConversion<string>();
            });
        }
    }
}
