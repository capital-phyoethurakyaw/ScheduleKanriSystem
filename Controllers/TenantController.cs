using Microsoft.AspNetCore.Mvc;

namespace ScheduleKanriSystem.Controllers
{
    [Route("{tenantId}/[controller]")]
    public class TenantController(IConfiguration configuration) : BaseController(configuration)
    {
        [Route("HomePage")]
        public IActionResult HomePage()
        {
            return View();
        }

        [Route("CreateTenant")]
        public IActionResult CreateTenant()
        {
            return View();
        }
    }
}
