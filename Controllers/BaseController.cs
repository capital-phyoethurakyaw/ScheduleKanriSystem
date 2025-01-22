using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace ScheduleKanriSystem.Controllers
{
    public class BaseController(IConfiguration configuration) : Controller
    {
        protected readonly IConfiguration _configuration = configuration;

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            ViewBag.JsVersion = _configuration.GetSection("AppSettings")["ScheduleKanri"];
            base.OnActionExecuting(filterContext);
        }
    }
}
