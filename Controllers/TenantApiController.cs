using Dapper;
using Microsoft.AspNetCore.Mvc;
using ScheduleKanriSystem.Data;
using ScheduleKanriSystem.Models;

namespace ScheduleKanriSystem.Controllers
{
    [Route("/api/tenant/")]
    [ApiController]
    public class TenantApiController(IGenericRepository<MemberModel> repo) : ControllerBase
    {
        private readonly IGenericRepository<MemberModel> _tenantRepo = repo;

        [HttpPost("tenantcheck")]
        public async Task<ActionResult<IReadOnlyList<ApiResponseModel>>> TenantCheck(TenantModel tenant)
        {
            var parameters = tenant.GetParam_TenantSelect();
            ApiResponseModel response = await _tenantRepo.ExecAsync("Tenant_Select", parameters, false);

            if (response.StatusCode == 200 && response?.Data is IEnumerable<dynamic> data && data.Any())
            {
                return Ok(response);
            }
            else
            {
                return NotFound(new ApiResponseModel
                {
                    StatusCode = 404,
                    Data = new
                    {
                        Message = "Tenant ID Not Found!"
                    }
                });
            }
        }

        [HttpPost("tenantavailablecheck")]
        public async Task<ActionResult<IReadOnlyList<ApiResponseModel>>> TenantAvailableCheck(TenantModel tenant)
        {
            var parameters = tenant.GetParam_TenantSelect();
            ApiResponseModel response = await _tenantRepo.ExecAsync("Tenant_Select", parameters, false);

            if (response.StatusCode == 200 && response?.Data is IEnumerable<dynamic> data && data.Any())
            {
                return Conflict(new ApiResponseModel
                {
                    StatusCode = 409,
                    Data = new
                    {
                        Message = "Tenant ID already exists."
                    }
                });
            }
            else
            {
                return Ok(response);
            }
        }

        [HttpPost("tenantprocess")]
        public async Task<ActionResult<IReadOnlyList<ApiResponseModel>>> TenantProcess(MemberModel member)
        {
            var parameters = member.GetParam_CreateWorkSpace();
            var result = await _tenantRepo.ExecAsync("CreateWorkspace",parameters,false);
            return Ok(result);
        }
    }
}
