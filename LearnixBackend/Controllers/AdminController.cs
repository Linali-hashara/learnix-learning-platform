using LearnixBackend.Services;
using LearnixBackend.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace LearnixBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("overview")]
        public async Task<IActionResult> GetOverview()
        {
            var response = await _adminService.GetOverviewAsync();

            if (response.Success)
            {
                return Ok(response);
            }

            return BadRequest(response);
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var response = await _adminService.GetUsersAsync();

            if (response.Success)
            {
                return Ok(response);
            }

            return BadRequest(response);
        }

        [HttpGet("insights")]
        public async Task<IActionResult> GetInsights([FromQuery] int? days, [FromQuery] DateTime? from, [FromQuery] DateTime? to)
        {
            var response = await _adminService.GetInsightsAsync(days, from, to);

            if (response.Success)
            {
                return Ok(response);
            }

            return BadRequest(response);
        }

        [HttpGet("courses")]
        public async Task<IActionResult> GetCourses()
        {
            var response = await _adminService.GetCoursesAsync();

            if (response.Success)
            {
                return Ok(response);
            }

            return BadRequest(response);
        }

        [HttpPost("courses")]
        public async Task<IActionResult> CreateCourse([FromBody] AdminCourseUpsertRequest request)
        {
            var response = await _adminService.CreateCourseAsync(request);

            if (response.Success)
            {
                return Ok(response);
            }

            return BadRequest(response);
        }

        [HttpPut("courses/{courseId:int}")]
        public async Task<IActionResult> UpdateCourse(int courseId, [FromBody] AdminCourseUpsertRequest request)
        {
            var response = await _adminService.UpdateCourseAsync(courseId, request);

            if (response.Success)
            {
                return Ok(response);
            }

            return BadRequest(response);
        }

        [HttpDelete("courses/{courseId:int}")]
        public async Task<IActionResult> DeleteCourse(int courseId)
        {
            var response = await _adminService.DeleteCourseAsync(courseId);

            if (response.Success)
            {
                return Ok(response);
            }

            return BadRequest(response);
        }

        [HttpPatch("courses/{courseId:int}/publish-status")]
        public async Task<IActionResult> SetCoursePublishStatus(int courseId, [FromBody] AdminCoursePublishStatusRequest request)
        {
            var response = await _adminService.SetCoursePublishStatusAsync(courseId, request.IsPublished);

            if (response.Success)
            {
                return Ok(response);
            }

            return BadRequest(response);
        }
    }
}