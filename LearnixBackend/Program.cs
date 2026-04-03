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
