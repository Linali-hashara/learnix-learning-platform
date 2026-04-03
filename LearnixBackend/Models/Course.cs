namespace LearnixBackend.Models
{
    public class Course
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Category { get; set; } = null!;
        public string Level { get; set; } = null!;
        public string Instructor { get; set; } = null!;
        public decimal Price { get; set; }
        public int Enrollments { get; set; } = 0;
        public double Rating { get; set; } = 0;
        public bool IsPublished { get; set; } = false;
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}