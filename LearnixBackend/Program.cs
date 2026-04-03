using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using LearnixBackend.Data;
using LearnixBackend.Services;

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
}
