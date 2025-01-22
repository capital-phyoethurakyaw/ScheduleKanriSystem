using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ScheduleKanriSystem.Data;
using ScheduleKanriSystem.Models;
using ScheduleKanriSystem.Utilities;
using System;

namespace ScheduleKanriSystem.Controllers
{
    [Route("/api/member/")]
    [ApiController]
    public class MemberApiController(IGenericRepository<MemberModel> repo, JwtService jwtService, IWebHostEnvironment environment) : ControllerBase
    {
        private readonly IGenericRepository<MemberModel> _memberRepo = repo;
        private readonly JwtService _jwtService = jwtService;
        private readonly IWebHostEnvironment _environment = environment;

        [HttpPost("logincheck")]
        public async Task<ActionResult<IReadOnlyList<ApiResponseModel>>> LoginCheck(MemberModel member)
        {
            var parameters = member.GetParam_LoginCheck();
            ApiResponseModel response = await _memberRepo.ExecAsync("Member_LoginCheck", parameters, false);

            if (response.StatusCode == 200 && response?.Data is IEnumerable<dynamic> data && data.Any())
            {
                var userData = data.FirstOrDefault();
                var tenantId = userData?.TenantID;
                var userId = userData?.UserID;
                var userRole= userData?.UserRole;
                var token = _jwtService.GenerateToken(tenantId + '-' + userId,tenantId);
                return Ok(new
                {
                    StatusCode = 200,
                    Token = token,
                    Data = userData 
                });
            }
            else
            {
                return Unauthorized(new ApiResponseModel
                {
                    StatusCode = 401,
                    Data = new
                    {
                        Message = "Login Failed! Email or password incorrect."
                    }
                });
            }
        }

        [Authorize]
        [HttpPost("getmember")]
        public async Task<ActionResult<IReadOnlyList<ApiResponseModel>>> MemberSelect(MemberModel member)
        {
            var parameters = member.GetParam_MemberSelect();
            ApiResponseModel response = await _memberRepo.ExecAsync("Member_Select", parameters, false);

            return Ok(response);
        }

        [Authorize]
        [HttpPost("memberprocess")]
        public async Task<ActionResult<IReadOnlyList<ApiResponseModel>>> MemberProcess(IFormFile? file, [FromForm] MemberModel member)
        {
            if (member.Mode == "New" && file == null)
            {
                member.ProfileImage = "default.png";
            }
            else if (member.Mode == "Edit" && file != null)
            {
                member.ProfileImage = member.UserID + ".png";
            }

            var parameters = member.GetParam_MemberProcess();
            ApiResponseModel response = await _memberRepo.ExecAsync("Member_Process", parameters, false);

            if (response.StatusCode == 200 && response?.Data is IEnumerable<dynamic> data && data.Any())
            {
                var userData = data.FirstOrDefault();
                var userId = userData?.UserID;

                if (file != null && file.Length > 0)
                {
                    var uploadFolder = Path.Combine(_environment.WebRootPath, "images", "profile");

                    if (System.IO.File.Exists(Path.Combine(uploadFolder, userId + ".png")))
                    {
                        System.IO.File.Delete(Path.Combine(uploadFolder, userId + ".png"));
                    }

                    if (!Directory.Exists(uploadFolder))
                    {
                        Directory.CreateDirectory(uploadFolder);
                    }

                    member.ProfileImage = userId + ".png";
                    var filePath = Path.Combine(uploadFolder, member.ProfileImage);

                    // Save the file to the server
                    try
                    {
                        using var stream = new FileStream(filePath, FileMode.Create);
                        await file.CopyToAsync(stream);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error saving file: {ex.Message}");
                    }
                }
            }

            return Ok(response);
        }

        [Authorize]
        [HttpPost("memberdelete")]
        public async Task<ActionResult<IReadOnlyList<ApiResponseModel>>> MemberDelete(MemberModel member)
        {
            var parameters = member.GetParam_MemberProcess();
            ApiResponseModel response = await _memberRepo.ExecAsync("Member_Process", parameters, false);
            return Ok(response);
        }
    }
}
