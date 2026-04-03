namespace LearnixBackend.DTOs
{
    public class OnboardingRequest
    {
        public int UserId { get; set; }
        public List<string> SelectedReasons { get; set; } = new();
    }

    public class OnboardingResponse
    {
        public int UserId { get; set; }
        public List<string> SavedReasons { get; set; } = new();
        public bool Success { get; set; }
        public string Message { get; set; } = null!;
    }
}
