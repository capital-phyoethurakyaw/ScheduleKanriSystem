using Dapper;

namespace ScheduleKanriSystem.Models
{
    public class TenantModel : BaseModel
    {
        public string? CompanyName { get; set; }
        public DynamicParameters GetParam_TenantSelect()
        {
            var parameters = new DynamicParameters();
            parameters.Add("@TenantID", TenantID);

            return parameters;
        }
    }
}
