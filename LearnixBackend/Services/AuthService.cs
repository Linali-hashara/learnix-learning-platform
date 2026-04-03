using LearnixBackend.Data;
using LearnixBackend.DTOs;
using LearnixBackend.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace LearnixBackend.Services
{
    public interface IAuthService
    {
        Task<SignUpResponse> SignUpAsync(SignUpRequest request);
        Task<LoginResponse> LoginAsync(LoginRequest request);
        Task<SaveUserPreferencesResponse> SaveUserPreferencesAsync(SaveUserPreferencesRequest request);
        Task<bool> ValidateEmailAsync(string email);
    }

    public class AuthService : IAuthService
    {
        private readonly LearnixContext _context;
        private readonly ILogger<AuthService> _logger;

        public AuthService(LearnixContext context, ILogger<AuthService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<SignUpResponse> SignUpAsync(SignUpRequest request)
        {
            try
            {
                _logger.LogInformation($"SignUp attempt for email: {request.Email}");

                // Validate input
                if (string.IsNullOrWhiteSpace(request.FullName))
                {
                    return new SignUpResponse
                    {
                        Success = false,
                        Message = "Full name is required"
                    };
                }

                if (string.IsNullOrWhiteSpace(request.Email))
                {
                    return new SignUpResponse
                    {
                        Success = false,
                        Message = "Email is required"
                    };
                }

                if (string.IsNullOrWhiteSpace(request.Password) || request.Password.Length < 6)
                {
                    return new SignUpResponse
                    {
                        Success = false,
                        Message = "Password must be at least 6 characters"
                    };
                }

                // Check if email already exists
                var existingUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == request.Email);

                if (existingUser != null)
                {
                    return new SignUpResponse
                    {
                        Success = false,
                        Message = "Email already registered"
                    };
                }

                // Hash password
                var passwordHash = HashPassword(request.Password);

                // Create new user
                var user = new User
                {
                    FullName = request.FullName.Trim(),
                    Email = request.Email.Trim().ToLower(),
                    PasswordHash = passwordHash,
                    IsAdmin = false
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"User registered successfully: {user.Email} (ID: {user.Id})");

                return new SignUpResponse
                {
                    UserId = user.Id,
                    FullName = user.FullName,
                    Email = user.Email,
                    Success = true,
                    Message = "User registered successfully"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error during sign up: {ex.Message}\n{ex.StackTrace}");
                return new SignUpResponse
                {
                    Success = false,
                    Message = $"Error: {ex.Message}"
                };
            }
        }

        public async Task<bool> ValidateEmailAsync(string email)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);
            return user == null;
        }

        public async Task<SaveUserPreferencesResponse> SaveUserPreferencesAsync(SaveUserPreferencesRequest request)
        {
            try
            {
                _logger.LogInformation($"Saving preferences for user ID: {request.UserId}");

                if (request.UserId <= 0)
                {
                    return new SaveUserPreferencesResponse
                    {
                        Success = false,
                        Message = "Invalid user ID"
                    };
                }

                if (string.IsNullOrWhiteSpace(request.Purpose))
                {
                    return new SaveUserPreferencesResponse
                    {
                        Success = false,
                        Message = "Purpose is required"
                    };
                }

                if (string.IsNullOrWhiteSpace(request.Role))
                {
                    return new SaveUserPreferencesResponse
                    {
                        Success = false,
                        Message = "Role is required"
                    };
                }

                // Find user and update preferences
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == request.UserId);

                if (user == null)
                {
                    _logger.LogWarning($"User not found for ID: {request.UserId}");
                    return new SaveUserPreferencesResponse
                    {
                        Success = false,
                        Message = "User not found"
                    };
                }

                // Update user preferences
                user.Purpose = request.Purpose.Trim();
                user.Role = request.Role.Trim();
                
                // Save skills as comma-separated string if provided
                if (request.Skills != null && request.Skills.Count > 0)
                {
                    user.Skills = string.Join(",", request.Skills);
                    _logger.LogInformation($"Skills saved: {user.Skills}");
                }

                // Save education level if provided
                if (!string.IsNullOrWhiteSpace(request.EducationLevel))
                {
                    user.EducationLevel = request.EducationLevel.Trim();
                    _logger.LogInformation($"Education level saved: {user.EducationLevel}");
                }

                user.UpdatedAt = DateTime.UtcNow;

                _context.Users.Update(user);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Preferences saved successfully for user ID: {request.UserId}");

                return new SaveUserPreferencesResponse
                {
                    UserId = user.Id,
                    Purpose = user.Purpose,
                    Role = user.Role,
                    Skills = user.Skills,
                    EducationLevel = user.EducationLevel,
                    Success = true,
                    Message = "Preferences saved successfully"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error saving preferences: {ex.Message}\n{ex.StackTrace}");
                return new SaveUserPreferencesResponse
                {
                    Success = false,
                    Message = $"Error: {ex.Message}"
                };
            }
        }

        public async Task<LoginResponse> LoginAsync(LoginRequest request)
        {
            try
            {
                _logger.LogInformation($"Login attempt for email: {request.Email}");

                // Validate input
                if (string.IsNullOrWhiteSpace(request.Email))
                {
                    return new LoginResponse
                    {
                        Success = false,
                        Message = "Email is required"
                    };
                }

                if (string.IsNullOrWhiteSpace(request.Password))
                {
                    return new LoginResponse
                    {
                        Success = false,
                        Message = "Password is required"
                    };
                }

                // Find user by email
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == request.Email.Trim().ToLower());

                if (user == null)
                {
                    _logger.LogWarning($"Login failed: User not found for email {request.Email}");
                    return new LoginResponse
                    {
                        Success = false,
                        Message = "Invalid email or password"
                    };
                }

                // Verify password
                var passwordHash = HashPassword(request.Password);
                if (user.PasswordHash != passwordHash)
                {
                    _logger.LogWarning($"Login failed: Invalid password for email {request.Email}");
                    return new LoginResponse
                    {
                        Success = false,
                        Message = "Invalid email or password"
                    };
                }

                _logger.LogInformation($"User logged in successfully: {user.Email} (ID: {user.Id})");

                return new LoginResponse
                {
                    UserId = user.Id,
                    FullName = user.FullName,
                    Email = user.Email,
                    IsAdmin = user.IsAdmin,
                    Success = true,
                    Message = "Login successful"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error during login: {ex.Message}\n{ex.StackTrace}");
                return new LoginResponse
                {
                    Success = false,
                    Message = $"Error: {ex.Message}"
                };
            }
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }
    }
}
