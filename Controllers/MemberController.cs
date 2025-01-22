using Microsoft.AspNetCore.Mvc;

namespace ScheduleKanriSystem.Controllers
{
    [Route("{tenantId}/[controller]")]
    public class MemberController(IConfiguration configuration) : BaseController(configuration)
    {
        [Route("MemberLogin")]
        public IActionResult MemberLogin()
        {
            return View();
        }

        [Route("MemberList")]
        public IActionResult MemberList()
        {
            return View();
        }
    }
}
