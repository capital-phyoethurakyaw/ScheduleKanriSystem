using Dapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.CodeAnalysis.Elfie.Diagnostics;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;

namespace ScheduleKanriSystem.Models
{
    public class DutyPlanModel  : BaseModel
    {
        public int DutyID { get; set; }
        public string? YYYY { get; set; }
        public string? MM { get; set; }
        public string? UserID { get; set; }
        public string? DutyDate { get; set; }

        public DynamicParameters GetParam_DutyPlanSelect()
        {
            var parameters = new DynamicParameters();
            parameters.Add("@TenantID", TenantID);
            parameters.Add("@YYYY", YYYY);
            parameters.Add("@MM", MM);
            parameters.Add("@UserID", UserID);

            return parameters;
        }

        public DynamicParameters GetParam_DutyPlanProcess()
        {
            var parameters = new DynamicParameters();
            parameters.Add("@Mode", Mode);
            parameters.Add("@TenantID", TenantID);
            parameters.Add("@DutyDate", DutyDate);
            parameters.Add("@UserID", UserID);
            parameters.Add("@CreatedBy", CreatedBy);

            return parameters;
        }

        //public string UserProfile { get; set; } 
        //public string Name_Role { get; set; }
        //public string MultiDate { get; set; }
        //public string Day_1 { get; set; }
        //public string Day_2 { get; set; }
        //public string Day_3 { get; set; }
        //public string Day_4 { get; set; }
        //public string Day_5 { get; set; }
        //public string Day_6 { get; set; }
        //public string Day_7 { get; set; }
        //public string Day_8 { get; set; }
        //public string Day_9 { get; set; }
        //public string Day_10 { get; set; }
        //public string Day_11 { get; set; }
        //public string Day_12 { get; set; }
        //public string Day_13 { get; set; }
        //public string Day_14 { get; set; }
        //public string Day_15 { get; set; }
        //public string Day_16 { get; set; }
        //public string Day_17 { get; set; }
        //public string Day_18 { get; set; }
        //public string Day_19 { get; set; }
        //public string Day_20 { get; set; }
        //public string Day_21 { get; set; }
        //public string Day_22 { get; set; }
        //public string Day_23 { get; set; }
        //public string Day_24 { get; set; }
        //public string Day_25 { get; set; }
        //public string Day_26 { get; set; }
        //public string Day_27 { get; set; }
        //public string Day_28 { get; set; }
        //public string Day_29 { get; set; }
        //public string Day_30 { get; set; }
        //public string Day_31 { get; set; }

    }
}
