using LearnixBackend.Data;
using LearnixBackend.DTOs;
using LearnixBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace LearnixBackend.Services
{
    public interface IOnboardingService
    {
        Task<OnboardingResponse> SaveJourneyReasonsAsync(OnboardingRequest request);
        Task<OnboardingResponse> GetUserJourneyReasonsAsync(int userId);
    }

    public class OnboardingService : IOnboardingService
    {
        private readonly LearnixContext _context;
        private readonly ILogger<OnboardingService> _logger;

        public OnboardingService(LearnixContext context, ILogger<OnboardingService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<OnboardingResponse> SaveJourneyReasonsAsync(OnboardingRequest request)
        {
            try
            {
                // Verify user exists
                var user = await _context.Users.FindAsync(request.UserId);
                if (user == null)
                {
                    return new OnboardingResponse
                    {
                        Success = false,
                        Message = "User not found"
                    };
                }

                // Clear existing reasons for this user
                var existingReasons = await _context.UserJourneyReasons
                    .Where(r => r.UserId == request.UserId)
                    .ToListAsync();

                if (existingReasons.Any())
                {
                    _context.UserJourneyReasons.RemoveRange(existingReasons);
                }

                // Add new reasons
                foreach (var reason in request.SelectedReasons)
                {
                    var journeyReason = new UserJourneyReason
                    {
                        UserId = request.UserId,
                        Reason = reason
                    };
                    _context.UserJourneyReasons.Add(journeyReason);
                }

                await _context.SaveChangesAsync();

                _logger.LogInformation($"Journey reasons saved for user {request.UserId}");

                return new OnboardingResponse
                {
                    UserId = request.UserId,
                    SavedReasons = request.SelectedReasons,
                    Success = true,
                    Message = "Journey reasons saved successfully"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error saving journey reasons: {ex.Message}");
                return new OnboardingResponse
                {
                    Success = false,
                    Message = $"Error: {ex.Message}"
                };
            }
        }

        public async Task<OnboardingResponse> GetUserJourneyReasonsAsync(int userId)
        {
            try
            {
                var reasons = await _context.UserJourneyReasons
                    .Where(r => r.UserId == userId)
                    .Select(r => r.Reason)
                    .ToListAsync();

                return new OnboardingResponse
                {
                    UserId = userId,
                    SavedReasons = reasons,
                    Success = true,
                    Message = "Journey reasons retrieved successfully"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving journey reasons: {ex.Message}");
                return new OnboardingResponse
                {
                    Success = false,
                    Message = $"Error: {ex.Message}"
                };
            }
        }
    }
}
