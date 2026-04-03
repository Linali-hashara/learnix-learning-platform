namespace LearnixBackend.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public bool IsAdmin { get; set; } = false;
        public string? Purpose { get; set; } // Why they chose Learnix
        public string? Role { get; set; } // Interested role (Writer, BA, SE, CIO)
        public string? Skills { get; set; } // JSON array of selected skills (stored as comma-separated for simplicity)
        public string? EducationLevel { get; set; } // Latest education level
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public ICollection<UserJourneyReason> JourneyReasons { get; set; } = new List<UserJourneyReason>();
    }
}
