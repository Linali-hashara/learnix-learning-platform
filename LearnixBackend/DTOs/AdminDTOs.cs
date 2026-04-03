using System.Text.Json.Serialization;

namespace LearnixBackend.DTOs
{
    public class AdminOverviewResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = null!;
        public int TotalUsers { get; set; }
        public int AdminUsers { get; set; }
        public int RecentUsers { get; set; }
        public int PendingInvitations { get; set; }
        public int AvailableLicenses { get; set; }
        public int RemainingLicenses { get; set; }
        public double LicenseUtilizationPercent { get; set; }
        public int ActiveUsers { get; set; }
        public int InactiveUsers { get; set; }
        public double ActiveUserPercent { get; set; }
        public string FeedbackStatus { get; set; } = null!;
        public AdminHighlight TopIndustryHighlight { get; set; } = new();
        public AdminHighlight TopOrganizationHighlight { get; set; } = new();
        public List<AdminMetricCard> MetricCards { get; set; } = new();
        public List<AdminUserSummary> RecentUsersList { get; set; } = new();
        public List<AdminBreakdownItem> TopSkills { get; set; } = new();
        public List<AdminBreakdownItem> TopRoles { get; set; } = new();
    }

    public class AdminUsersResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = null!;
        public List<AdminUserDetail> Users { get; set; } = new();
    }

    public class AdminInsightsResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = null!;
        public DateTime AppliedRangeStart { get; set; }
        public DateTime AppliedRangeEnd { get; set; }
        public string AppliedRangeLabel { get; set; } = null!;
        public int TotalUsers { get; set; }
        public int ActiveUsers { get; set; }
        public int InactiveUsers { get; set; }
        public int AdminUsers { get; set; }
        public double ActiveUserPercent { get; set; }
        public double AvgSkillsPerUser { get; set; }
        public List<AdminMonthlyPoint> MonthlyRegistrations { get; set; } = new();
        public List<AdminBreakdownItem> RoleBreakdown { get; set; } = new();
        public List<AdminBreakdownItem> EducationBreakdown { get; set; } = new();
        public List<AdminBreakdownItem> PurposeBreakdown { get; set; } = new();
    }

    public class AdminCoursesResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = null!;
        public int TotalCourses { get; set; }
        public int PublishedCourses { get; set; }
        public int DraftCourses { get; set; }
        public int TotalEnrollments { get; set; }
        public List<AdminCourseDetail> Courses { get; set; } = new();
    }

    public class AdminCourseDetail
    {
        public int CourseId { get; set; }
        public string Title { get; set; } = null!;
        public string Category { get; set; } = null!;
        public string Level { get; set; } = null!;
        public string Instructor { get; set; } = null!;
        public decimal Price { get; set; }
        public int Enrollments { get; set; }
        public double Rating { get; set; }
        public bool IsPublished { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class AdminCourseUpsertRequest
    {
        public string Title { get; set; } = null!;
        public string Category { get; set; } = null!;
        public string Level { get; set; } = null!;
        public string Instructor { get; set; } = null!;
        public decimal Price { get; set; }
        public int Enrollments { get; set; }
        public double Rating { get; set; }
        public string? Description { get; set; }
        [JsonPropertyName("isPublished")]
        public bool IsPublished { get; set; }
    }

    public class AdminCoursePublishStatusRequest
    {
        [JsonPropertyName("isPublished")]
        public bool IsPublished { get; set; }
    }

    public class AdminMonthlyPoint
    {
        public string Label { get; set; } = null!;
        public int Count { get; set; }
    }

    public class AdminHighlight
    {
        public string Title { get; set; } = null!;
        public string Value { get; set; } = null!;
        public double Percent { get; set; }
    }

    public class AdminMetricCard
    {
        public string Title { get; set; } = null!;
        public string Value { get; set; } = null!;
        public string Description { get; set; } = null!;
    }

    public class AdminUserSummary
    {
        public int UserId { get; set; }
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Role { get; set; }
        public string? Purpose { get; set; }
        public bool IsAdmin { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class AdminUserDetail
    {
        public int UserId { get; set; }
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Purpose { get; set; }
        public string? Role { get; set; }
        public string Skills { get; set; } = string.Empty;
        public string? EducationLevel { get; set; }
        public bool IsAdmin { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int JourneyReasonCount { get; set; }
        public List<string> JourneyReasons { get; set; } = new();
    }

    public class AdminBreakdownItem
    {
        public string Name { get; set; } = null!;
        public int Count { get; set; }
        public double Percent { get; set; }
    }
}