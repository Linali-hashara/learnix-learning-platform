namespace LearnixBackend.Models
{
    public class UserJourneyReason
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Reason { get; set; } = null!; // start_career, grow_career, change_career, gain_knowledge
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public User User { get; set; } = null!;
    }
}
