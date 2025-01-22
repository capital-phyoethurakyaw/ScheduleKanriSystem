using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ScheduleKanriSystem.Controllers
{
    [Route("{tenantId}/[controller]")]
    public class DutyPlanController(IConfiguration configuration) : BaseController(configuration)
    {
        [Route("DutyPlan")]
        public IActionResult DutyPlan()
        {
            return View();
        }

        [Route("DutyPlanTable")]
        public IActionResult DutyPlanTable()
        {
            return View();
        }

    }
}
