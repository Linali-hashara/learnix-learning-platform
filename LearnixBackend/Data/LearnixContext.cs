using Microsoft.EntityFrameworkCore;
using LearnixBackend.Models;

namespace LearnixBackend.Data
{
    public class LearnixContext : DbContext
    {
        public LearnixContext(DbContextOptions<LearnixContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<UserJourneyReason> UserJourneyReasons { get; set; } = null!;
        public DbSet<Course> Courses { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.FullName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.PasswordHash).IsRequired();
            });

            // UserJourneyReason configuration
            modelBuilder.Entity<UserJourneyReason>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Reason).IsRequired().HasMaxLength(50);
                
                entity.HasOne(e => e.User)
                    .WithMany(u => u.JourneyReasons)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Course>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(160);
                entity.Property(e => e.Category).IsRequired().HasMaxLength(80);
                entity.Property(e => e.Level).IsRequired().HasMaxLength(40);
                entity.Property(e => e.Instructor).IsRequired().HasMaxLength(120);
                entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Description).HasMaxLength(1000);
            });
        }
    }
}
