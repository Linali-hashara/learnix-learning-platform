using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using LearnixBackend.Data;
using LearnixBackend.Models;
using LearnixBackend.Services;
using System.Security.Cryptography;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder =>
        {
            builder.WithOrigins("http://localhost:3000", "http://localhost:3001", "http://localhost:5173")
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
});

// Add Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<LearnixBackend.Data.LearnixContext>(options =>
    options.UseSqlServer(connectionString, sqlOptions => 
    {
        sqlOptions.EnableRetryOnFailure();
    }));

// Add Services
builder.Services.AddScoped<LearnixBackend.Services.IAuthService, LearnixBackend.Services.AuthService>();
builder.Services.AddScoped<LearnixBackend.Services.IOnboardingService, LearnixBackend.Services.OnboardingService>();
builder.Services.AddScoped<LearnixBackend.Services.IAdminService, LearnixBackend.Services.AdminService>();

// Add Logging
builder.Services.AddLogging();

var app = builder.Build();

await EnsureDatabaseSchemaAsync(app.Services);

// Log environment info
var logger = app.Services.GetRequiredService<ILogger<Program>>();
logger.LogInformation($"Environment: {app.Environment.EnvironmentName}");
logger.LogInformation($"Database Connection: {builder.Configuration.GetConnectionString("DefaultConnection")}");

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Only redirect to HTTPS in production
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("AllowReactApp");
app.UseAuthorization();
app.MapControllers();

// Health check endpoint
app.MapGet("/api/health", () => 
    Results.Ok(new { status = "Backend server is running!", timestamp = DateTime.UtcNow }))
    .WithName("Health")
    .WithOpenApi();

app.Run();

static async Task EnsureDatabaseSchemaAsync(IServiceProvider services)
{
    using var scope = services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<LearnixContext>();

    await context.Database.EnsureCreatedAsync();

    var schemaUpdates = new[]
    {
        @"IF OBJECT_ID('dbo.Courses', 'U') IS NULL
          BEGIN
              CREATE TABLE dbo.Courses
              (
                  Id INT IDENTITY(1,1) PRIMARY KEY,
                  Title NVARCHAR(160) NOT NULL,
                  Category NVARCHAR(80) NOT NULL,
                  Level NVARCHAR(40) NOT NULL,
                  Instructor NVARCHAR(120) NOT NULL,
                  Price DECIMAL(18,2) NOT NULL CONSTRAINT DF_Courses_Price DEFAULT (0),
                  Enrollments INT NOT NULL CONSTRAINT DF_Courses_Enrollments DEFAULT (0),
                  Rating FLOAT NOT NULL CONSTRAINT DF_Courses_Rating DEFAULT (0),
                  IsPublished BIT NOT NULL CONSTRAINT DF_Courses_IsPublished DEFAULT (0),
                  Description NVARCHAR(1000) NULL,
                  CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_Courses_CreatedAt DEFAULT (SYSUTCDATETIME()),
                  UpdatedAt DATETIME2 NOT NULL CONSTRAINT DF_Courses_UpdatedAt DEFAULT (SYSUTCDATETIME())
              );
          END",
        "IF COL_LENGTH('dbo.Users', 'IsAdmin') IS NULL ALTER TABLE dbo.Users ADD IsAdmin BIT NOT NULL CONSTRAINT DF_Users_IsAdmin DEFAULT (0);",
        "IF COL_LENGTH('dbo.Users', 'Purpose') IS NULL ALTER TABLE dbo.Users ADD Purpose NVARCHAR(MAX) NULL;",
        "IF COL_LENGTH('dbo.Users', 'Role') IS NULL ALTER TABLE dbo.Users ADD Role NVARCHAR(MAX) NULL;",
        "IF COL_LENGTH('dbo.Users', 'Skills') IS NULL ALTER TABLE dbo.Users ADD Skills NVARCHAR(MAX) NULL;",
        "IF COL_LENGTH('dbo.Users', 'EducationLevel') IS NULL ALTER TABLE dbo.Users ADD EducationLevel NVARCHAR(MAX) NULL;",
        "IF COL_LENGTH('dbo.Users', 'CreatedAt') IS NULL ALTER TABLE dbo.Users ADD CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_Users_CreatedAt DEFAULT (SYSUTCDATETIME());",
        "IF COL_LENGTH('dbo.Users', 'UpdatedAt') IS NULL ALTER TABLE dbo.Users ADD UpdatedAt DATETIME2 NOT NULL CONSTRAINT DF_Users_UpdatedAt DEFAULT (SYSUTCDATETIME());"
    };

    foreach (var sql in schemaUpdates)
    {
        await context.Database.ExecuteSqlRawAsync(sql);
    }

    const string adminEmail = "admin@gmail.com";
    const string adminPassword = "admin1234";

    var existingAdmin = await context.Users.FirstOrDefaultAsync(u => u.Email == adminEmail);
    if (existingAdmin == null)
    {
        context.Users.Add(new User
        {
            FullName = "System Admin",
            Email = adminEmail,
            PasswordHash = HashPassword(adminPassword),
            IsAdmin = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        });

        await context.SaveChangesAsync();
    }
    else if (!existingAdmin.IsAdmin)
    {
        existingAdmin.IsAdmin = true;
        existingAdmin.UpdatedAt = DateTime.UtcNow;
        await context.SaveChangesAsync();
    }

    if (!await context.Courses.AnyAsync())
    {
        context.Courses.AddRange(
            new Course
            {
                Title = "Python for Data Science",
                Category = "Programming",
                Level = "Intermediate",
                Instructor = "Nimal Perera",
                Price = 19,
                Enrollments = 1240,
                Rating = 4.8,
                IsPublished = true,
                Description = "Learn data analysis, visualization, and machine learning basics using Python.",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Course
            {
                Title = "Business Analytics 101",
                Category = "Analytics",
                Level = "Beginner",
                Instructor = "Kasuni Silva",
                Price = 0,
                Enrollments = 2180,
                Rating = 4.6,
                IsPublished = true,
                Description = "A beginner-friendly path to business metrics, dashboards, and reporting.",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Course
            {
                Title = "Advanced SQL Queries",
                Category = "Database",
                Level = "Advanced",
                Instructor = "Tharindu Jay",
                Price = 15,
                Enrollments = 890,
                Rating = 4.5,
                IsPublished = true,
                Description = "Master joins, CTEs, window functions, and optimization techniques.",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Course
            {
                Title = "Executive Decision Making",
                Category = "Career",
                Level = "Advanced",
                Instructor = "Shanika Fernando",
                Price = 49,
                Enrollments = 340,
                Rating = 4.3,
                IsPublished = false,
                Description = "Strategic thinking and decision frameworks for senior roles.",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        );

        await context.SaveChangesAsync();
    }
}

static string HashPassword(string password)
{
    using var sha256 = SHA256.Create();
    var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
    return Convert.ToBase64String(hashedBytes);
}
