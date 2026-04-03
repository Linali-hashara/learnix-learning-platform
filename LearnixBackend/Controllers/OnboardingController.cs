using LearnixBackend.DTOs;
using LearnixBackend.Services;
using Microsoft.AspNetCore.Mvc;

namespace LearnixBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OnboardingController : ControllerBase
    {
        private readonly IOnboardingService _onboardingService;
        private readonly ILogger<OnboardingController> _logger;

        public OnboardingController(IOnboardingService onboardingService, ILogger<OnboardingController> logger)
        {
            _onboardingService = onboardingService;
            _logger = logger;
        }

        [HttpPost("save-journey-reasons")]
        public async Task<IActionResult> SaveJourneyReasons([FromBody] OnboardingRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = await _onboardingService.SaveJourneyReasonsAsync(request);

            if (response.Success)
            {
                return Ok(response);
            }

            return BadRequest(response);
        }

        [HttpGet("journey-reasons/{userId}")]
        public async Task<IActionResult> GetJourneyReasons(int userId)
        {
            var response = await _onboardingService.GetUserJourneyReasonsAsync(userId);

            if (response.Success)
            {
                return Ok(response);
            }

            return NotFound(response);
        }
    }
}
