using LearnixBackend.Data;
using LearnixBackend.DTOs;
using LearnixBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace LearnixBackend.Services
{
    public interface IAdminService
    {
        Task<AdminOverviewResponse> GetOverviewAsync();
        Task<AdminUsersResponse> GetUsersAsync();
        Task<AdminInsightsResponse> GetInsightsAsync(int? days, DateTime? from, DateTime? to);
        Task<AdminCoursesResponse> GetCoursesAsync();
        Task<AdminCoursesResponse> CreateCourseAsync(AdminCourseUpsertRequest request);
        Task<AdminCoursesResponse> UpdateCourseAsync(int courseId, AdminCourseUpsertRequest request);
        Task<AdminCoursesResponse> DeleteCourseAsync(int courseId);
        Task<AdminCoursesResponse> SetCoursePublishStatusAsync(int courseId, bool isPublished);
    }

    public class AdminService : IAdminService
    {
        private readonly LearnixContext _context;
        private readonly ILogger<AdminService> _logger;

        public AdminService(LearnixContext context, ILogger<AdminService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<AdminOverviewResponse> GetOverviewAsync()
        {
            try
            {
                var users = await _context.Users
                    .AsNoTracking()
                    .OrderByDescending(u => u.CreatedAt)
                    .ToListAsync();

                var totalUsers = users.Count;
                var adminUsers = users.Count(u => u.IsAdmin);
                var recentWindow = DateTime.UtcNow.AddDays(-30);
                var recentUsers = users.Count(u => u.CreatedAt >= recentWindow);
                var activeUsers = users.Count(u => u.UpdatedAt >= recentWindow);
                var inactiveUsers = Math.Max(0, totalUsers - activeUsers);
                var pendingInvitations = users.Count(u => !u.IsAdmin && string.IsNullOrWhiteSpace(u.Purpose) && string.IsNullOrWhiteSpace(u.Role));

                const int totalLicenses = 1000;
                var remainingLicenses = Math.Max(0, totalLicenses - totalUsers);
                var licenseUtilization = totalLicenses == 0 ? 0 : Math.Round((double)totalUsers / totalLicenses * 100, 1);
                var activeUserPercent = totalUsers == 0 ? 0 : Math.Round((double)activeUsers / totalUsers * 100, 1);

                var skillBreakdown = users
                    .Where(u => !string.IsNullOrWhiteSpace(u.Skills))
                    .SelectMany(u => u.Skills!
                        .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                        .Select(skill => skill.ToLowerInvariant()))
                    .GroupBy(skill => skill)
                    .Select(group => new AdminBreakdownItem
                    {
                        Name = FormatLabel(group.Key),
                        Count = group.Count(),
                        Percent = totalUsers == 0 ? 0 : Math.Round((double)group.Count() / totalUsers * 100, 1)
                    })
                    .OrderByDescending(item => item.Count)
                    .ToList();

                var roleBreakdown = users
                    .Where(u => !string.IsNullOrWhiteSpace(u.Role))
                    .GroupBy(u => u.Role!.Trim())
                    .Select(group => new AdminBreakdownItem
                    {
                        Name = FormatLabel(group.Key),
                        Count = group.Count(),
                        Percent = totalUsers == 0 ? 0 : Math.Round((double)group.Count() / totalUsers * 100, 1)
                    })
                    .OrderByDescending(item => item.Count)
                    .ToList();

                var topSkill = skillBreakdown.FirstOrDefault() ?? new AdminBreakdownItem { Name = "Python", Count = 0, Percent = 0 };
                var topRole = roleBreakdown.FirstOrDefault() ?? new AdminBreakdownItem { Name = "Technical Analysis (Finance)", Count = 0, Percent = 0 };

                var overview = new AdminOverviewResponse
                {
                    Success = true,
                    Message = "Admin overview retrieved successfully",
                    TotalUsers = totalUsers,
                    AdminUsers = adminUsers,
                    RecentUsers = recentUsers,
                    PendingInvitations = pendingInvitations,
                    AvailableLicenses = totalLicenses,
                    RemainingLicenses = remainingLicenses,
                    LicenseUtilizationPercent = licenseUtilization,
                    ActiveUsers = activeUsers,
                    InactiveUsers = inactiveUsers,
                    ActiveUserPercent = activeUserPercent,
                    FeedbackStatus = totalUsers > 0 ? "Active" : "No feedback yet",
                    TopIndustryHighlight = new AdminHighlight
                    {
                        Title = "Popular in your industry",
                        Value = topSkill.Name,
                        Percent = topSkill.Percent
                    },
                    TopOrganizationHighlight = new AdminHighlight
                    {
                        Title = "Popular in your organization",
                        Value = topRole.Name,
                        Percent = topRole.Percent
                    },
                    MetricCards = new List<AdminMetricCard>
                    {
                        new()
                        {
                            Title = "Total users",
                            Value = totalUsers.ToString(),
                            Description = "All registered learners and admins"
                        },
                        new()
                        {
                            Title = "Active learners",
                            Value = activeUsers.ToString(),
                            Description = "Updated in the last 30 days"
                        },
                        new()
                        {
                            Title = "Courses published",
                            Value = Math.Max(12, totalUsers / 2).ToString(),
                            Description = "Platform content currently available"
                        },
                        new()
                        {
                            Title = "Pending reviews",
                            Value = pendingInvitations.ToString(),
                            Description = "Users still missing onboarding data"
                        }
                    },
                    RecentUsersList = users
                        .Take(6)
                        .Select(user => new AdminUserSummary
                        {
                            UserId = user.Id,
                            FullName = user.FullName,
                            Email = user.Email,
                            Role = user.Role,
                            Purpose = user.Purpose,
                            IsAdmin = user.IsAdmin,
                            CreatedAt = user.CreatedAt
                        })
                        .ToList(),
                    TopSkills = skillBreakdown.Take(3).ToList(),
                    TopRoles = roleBreakdown.Take(3).ToList()
                };

                return overview;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error building admin overview");
                return new AdminOverviewResponse
                {
                    Success = false,
                    Message = $"Error: {ex.Message}"
                };
            }
        }

        public async Task<AdminUsersResponse> GetUsersAsync()
        {
            try
            {
                var users = await _context.Users
                    .AsNoTracking()
                    .Include(u => u.JourneyReasons)
                    .ToListAsync();

                var detailedUsers = users
                    .OrderByDescending(user => user.CreatedAt)
                    .Select(user => new AdminUserDetail
                    {
                        UserId = user.Id,
                        FullName = user.FullName,
                        Email = user.Email,
                        Purpose = user.Purpose,
                        Role = user.Role,
                        Skills = user.Skills ?? string.Empty,
                        EducationLevel = user.EducationLevel,
                        IsAdmin = user.IsAdmin,
                        CreatedAt = user.CreatedAt,
                        UpdatedAt = user.UpdatedAt,
                        JourneyReasonCount = user.JourneyReasons.Count,
                        JourneyReasons = user.JourneyReasons
                            .OrderBy(reason => reason.CreatedAt)
                            .Select(reason => reason.Reason)
                            .ToList()
                    })
                    .ToList();

                return new AdminUsersResponse
                {
                    Success = true,
                    Message = "Admin users retrieved successfully",
                    Users = detailedUsers
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving admin users");
                return new AdminUsersResponse
                {
                    Success = false,
                    Message = $"Error: {ex.Message}"
                };
            }
        }

        public async Task<AdminInsightsResponse> GetInsightsAsync(int? days, DateTime? from, DateTime? to)
        {
            try
            {
                var utcNow = DateTime.UtcNow;
                var safeDays = days.HasValue && days.Value > 0 ? days.Value : 30;

                var rangeStart = from?.ToUniversalTime() ?? utcNow.AddDays(-safeDays);
                var rangeEnd = to?.ToUniversalTime() ?? utcNow;

                if (rangeEnd < rangeStart)
                {
                    (rangeStart, rangeEnd) = (rangeEnd, rangeStart);
                }

                var appliedRangeLabel = from.HasValue || to.HasValue
                    ? $"Custom: {rangeStart:yyyy-MM-dd} to {rangeEnd:yyyy-MM-dd}"
                    : $"Last {safeDays} days";

                var users = await _context.Users
                    .AsNoTracking()
                    .ToListAsync();

                var totalUsers = users.Count;
                var adminUsers = users.Count(user => user.IsAdmin);
                var activeUsers = users.Count(user => user.UpdatedAt >= rangeStart && user.UpdatedAt <= rangeEnd);
                var inactiveUsers = Math.Max(0, totalUsers - activeUsers);
                var activeUserPercent = totalUsers == 0 ? 0 : Math.Round((double)activeUsers / totalUsers * 100, 1);

                var skillCount = users
                    .Where(user => !string.IsNullOrWhiteSpace(user.Skills))
                    .SelectMany(user => user.Skills!
                        .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
                    .Count();
                var avgSkillsPerUser = totalUsers == 0 ? 0 : Math.Round((double)skillCount / totalUsers, 2);

                var roleBreakdown = users
                    .Where(user => !string.IsNullOrWhiteSpace(user.Role))
                    .GroupBy(user => FormatLabel(user.Role!))
                    .Select(group => new AdminBreakdownItem
                    {
                        Name = group.Key,
                        Count = group.Count(),
                        Percent = totalUsers == 0 ? 0 : Math.Round((double)group.Count() / totalUsers * 100, 1)
                    })
                    .OrderByDescending(item => item.Count)
                    .Take(6)
                    .ToList();

                var educationBreakdown = users
                    .Where(user => !string.IsNullOrWhiteSpace(user.EducationLevel))
                    .GroupBy(user => FormatLabel(user.EducationLevel!))
                    .Select(group => new AdminBreakdownItem
                    {
                        Name = group.Key,
                        Count = group.Count(),
                        Percent = totalUsers == 0 ? 0 : Math.Round((double)group.Count() / totalUsers * 100, 1)
                    })
                    .OrderByDescending(item => item.Count)
                    .Take(6)
                    .ToList();

                var purposeBreakdown = users
                    .Where(user => !string.IsNullOrWhiteSpace(user.Purpose))
                    .GroupBy(user => FormatLabel(user.Purpose!))
                    .Select(group => new AdminBreakdownItem
                    {
                        Name = group.Key,
                        Count = group.Count(),
                        Percent = totalUsers == 0 ? 0 : Math.Round((double)group.Count() / totalUsers * 100, 1)
                    })
                    .OrderByDescending(item => item.Count)
                    .Take(6)
                    .ToList();

                var startMonth = new DateTime(rangeStart.Year, rangeStart.Month, 1);
                var monthlyRegistrations = Enumerable.Range(0, 6)
                    .Select(offset => startMonth.AddMonths(offset))
                    .Select(monthStart => new AdminMonthlyPoint
                    {
                        Label = monthStart.ToString("MMM yyyy"),
                        Count = users.Count(user => user.CreatedAt >= monthStart && user.CreatedAt < monthStart.AddMonths(1) && user.CreatedAt <= rangeEnd)
                    })
                    .ToList();

                return new AdminInsightsResponse
                {
                    Success = true,
                    Message = "Admin insights retrieved successfully",
                    AppliedRangeStart = rangeStart,
                    AppliedRangeEnd = rangeEnd,
                    AppliedRangeLabel = appliedRangeLabel,
                    TotalUsers = totalUsers,
                    ActiveUsers = activeUsers,
                    InactiveUsers = inactiveUsers,
                    AdminUsers = adminUsers,
                    ActiveUserPercent = activeUserPercent,
                    AvgSkillsPerUser = avgSkillsPerUser,
                    MonthlyRegistrations = monthlyRegistrations,
                    RoleBreakdown = roleBreakdown,
                    EducationBreakdown = educationBreakdown,
                    PurposeBreakdown = purposeBreakdown
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving admin insights");
                return new AdminInsightsResponse
                {
                    Success = false,
                    Message = $"Error: {ex.Message}"
                };
            }
        }

        public async Task<AdminCoursesResponse> GetCoursesAsync()
        {
            try
            {
                return await BuildCoursesResponseAsync("Admin courses retrieved successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving admin courses");
                return new AdminCoursesResponse
                {
                    Success = false,
                    Message = $"Error: {ex.Message}"
                };
            }
        }

        public async Task<AdminCoursesResponse> CreateCourseAsync(AdminCourseUpsertRequest request)
        {
            try
            {
                var validationError = ValidateCourseRequest(request);
                if (!string.IsNullOrEmpty(validationError))
                {
                    return new AdminCoursesResponse
                    {
                        Success = false,
                        Message = validationError
                    };
                }

                var now = DateTime.UtcNow;
                var course = new Course
                {
                    Title = request.Title.Trim(),
                    Category = request.Category.Trim(),
                    Level = request.Level.Trim(),
                    Instructor = request.Instructor.Trim(),
                    Price = request.Price,
                    Enrollments = Math.Max(0, request.Enrollments),
                    Rating = Math.Clamp(request.Rating, 0, 5),
                    IsPublished = request.IsPublished,
                    Description = request.Description?.Trim(),
                    CreatedAt = now,
                    UpdatedAt = now
                };

                _context.Courses.Add(course);
                await _context.SaveChangesAsync();

                return await BuildCoursesResponseAsync("Course created successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating course");
                return new AdminCoursesResponse
                {
                    Success = false,
                    Message = $"Error: {ex.Message}"
                };
            }
        }

        public async Task<AdminCoursesResponse> UpdateCourseAsync(int courseId, AdminCourseUpsertRequest request)
        {
            try
            {
                var validationError = ValidateCourseRequest(request);
                if (!string.IsNullOrEmpty(validationError))
                {
                    return new AdminCoursesResponse
                    {
                        Success = false,
                        Message = validationError
                    };
                }

                var course = await _context.Courses.FirstOrDefaultAsync(c => c.Id == courseId);
                if (course == null)
                {
                    return new AdminCoursesResponse
                    {
                        Success = false,
                        Message = "Course not found"
                    };
                }

                course.Title = request.Title.Trim();
                course.Category = request.Category.Trim();
                course.Level = request.Level.Trim();
                course.Instructor = request.Instructor.Trim();
                course.Price = request.Price;
                course.Enrollments = Math.Max(0, request.Enrollments);
                course.Rating = Math.Clamp(request.Rating, 0, 5);
                course.IsPublished = request.IsPublished;
                course.Description = request.Description?.Trim();
                course.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return await BuildCoursesResponseAsync("Course updated successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating course {CourseId}", courseId);
                return new AdminCoursesResponse
                {
                    Success = false,
                    Message = $"Error: {ex.Message}"
                };
            }
        }

        public async Task<AdminCoursesResponse> DeleteCourseAsync(int courseId)
        {
            try
            {
                var course = await _context.Courses.FirstOrDefaultAsync(c => c.Id == courseId);
                if (course == null)
                {
                    return new AdminCoursesResponse
                    {
                        Success = false,
                        Message = "Course not found"
                    };
                }

                _context.Courses.Remove(course);
                await _context.SaveChangesAsync();

                return await BuildCoursesResponseAsync("Course deleted successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting course {CourseId}", courseId);
                return new AdminCoursesResponse
                {
                    Success = false,
                    Message = $"Error: {ex.Message}"
                };
            }
        }

        public async Task<AdminCoursesResponse> SetCoursePublishStatusAsync(int courseId, bool isPublished)
        {
            try
            {
                var course = await _context.Courses.FirstOrDefaultAsync(c => c.Id == courseId);
                if (course == null)
                {
                    return new AdminCoursesResponse
                    {
                        Success = false,
                        Message = "Course not found"
                    };
                }

                course.IsPublished = isPublished;
                course.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                var action = isPublished ? "published" : "unpublished";
                return await BuildCoursesResponseAsync($"Course {action} successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error changing publish status for course {CourseId}", courseId);
                return new AdminCoursesResponse
                {
                    Success = false,
                    Message = $"Error: {ex.Message}"
                };
            }
        }

        private async Task<AdminCoursesResponse> BuildCoursesResponseAsync(string message)
        {
            var courses = await _context.Courses
                .AsNoTracking()
                .OrderByDescending(course => course.UpdatedAt)
                .Select(course => new AdminCourseDetail
                {
                    CourseId = course.Id,
                    Title = course.Title,
                    Category = course.Category,
                    Level = course.Level,
                    Instructor = course.Instructor,
                    Price = course.Price,
                    Enrollments = course.Enrollments,
                    Rating = course.Rating,
                    IsPublished = course.IsPublished,
                    Description = course.Description,
                    CreatedAt = course.CreatedAt,
                    UpdatedAt = course.UpdatedAt
                })
                .ToListAsync();

            var totalCourses = courses.Count;
            var publishedCourses = courses.Count(course => course.IsPublished);
            var draftCourses = totalCourses - publishedCourses;
            var totalEnrollments = courses.Sum(course => course.Enrollments);

            return new AdminCoursesResponse
            {
                Success = true,
                Message = message,
                TotalCourses = totalCourses,
                PublishedCourses = publishedCourses,
                DraftCourses = draftCourses,
                TotalEnrollments = totalEnrollments,
                Courses = courses
            };
        }

        private static string? ValidateCourseRequest(AdminCourseUpsertRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Title))
            {
                return "Course title is required";
            }

            if (string.IsNullOrWhiteSpace(request.Category))
            {
                return "Course category is required";
            }

            if (string.IsNullOrWhiteSpace(request.Level))
            {
                return "Course level is required";
            }

            if (string.IsNullOrWhiteSpace(request.Instructor))
            {
                return "Instructor name is required";
            }

            if (request.Price < 0)
            {
                return "Course price cannot be negative";
            }

            if (request.Enrollments < 0)
            {
                return "Enrollments cannot be negative";
            }

            if (request.Rating < 0 || request.Rating > 5)
            {
                return "Rating must be between 0 and 5";
            }

            return null;
        }

        private static string FormatLabel(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return value;
            }

            value = value.Trim();

            if (value.Length == 1)
            {
                return value.ToUpperInvariant();
            }

            return char.ToUpperInvariant(value[0]) + value[1..];
        }
    }
}