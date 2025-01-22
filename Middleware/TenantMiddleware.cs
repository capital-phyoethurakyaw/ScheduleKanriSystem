namespace ScheduleKanriSystem.Middleware
{
    public class TenantMiddleware(RequestDelegate next)
    {
        private readonly RequestDelegate _next = next;

        public async Task InvokeAsync(HttpContext context)
        {
            var path = context.Request.Path.Value;
            if (!string.IsNullOrEmpty(path))
            {
                var segments = path.Split('/');
                if (segments.Length > 1)
                {
                    var tenantId = segments[1];
                    if(tenantId != "Tenant" && tenantId != "api")
                    {
                        context.Items["TenantID"] = tenantId;
                    }
                }
            }
            await _next(context);
        }
    }
}
