using System.ComponentModel.DataAnnotations;

namespace LearnixBackend.DTOs
{
    public class SignUpRequest
    {
        [Required(ErrorMessage = "Full name is required")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Full name must be between 2 and 100 characters")]
        public string FullName { get; set; } = null!;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "Password is required")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters")]
        public string Password { get; set; } = null!;
    }

    public class SignUpResponse
    {
        public int UserId { get; set; }
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public bool Success { get; set; }
        public string Message { get; set; } = null!;
    }

    public class LoginRequest
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "Password is required")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters")]
        public string Password { get; set; } = null!;
    }

    public class LoginResponse
    {
        public int UserId { get; set; }
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public bool IsAdmin { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; } = null!;
    }

    public class SaveUserPreferencesRequest
    {
        [Required(ErrorMessage = "UserId is required")]
        public int UserId { get; set; }

        [Required(ErrorMessage = "Purpose is required")]
        public string Purpose { get; set; } = null!;

        [Required(ErrorMessage = "Role is required")]
        public string Role { get; set; } = null!;

        public List<string>? Skills { get; set; } // Optional list of selected skills

        public string? EducationLevel { get; set; } // Optional education level
    }

    public class SaveUserPreferencesResponse
    {
        public int UserId { get; set; }
        public string Purpose { get; set; } = null!;
        public string Role { get; set; } = null!;
        public string? Skills { get; set; }
        public string? EducationLevel { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; } = null!;
    }
}
