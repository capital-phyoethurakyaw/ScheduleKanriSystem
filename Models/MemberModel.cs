using Dapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.CodeAnalysis.Elfie.Diagnostics;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;

namespace ScheduleKanriSystem.Models
{
    public class MemberModel : TenantModel
    {
        public string? UserID { get; set; }
        public string? UserName { get; set; }
        public string? Password { get; set; }
        public string? Email { get; set; }
        public string? Position { get; set; }
        public string? MobileNumber { get; set; }
        public string? ProfileImage { get; set; }
        public string? UserRole { get; set; }

        public DynamicParameters GetParam_CreateWorkSpace()
        {
            var parameters = new DynamicParameters();
            parameters.Add("@TenantID", TenantID);
            parameters.Add("@CompanyName", CompanyName);
            parameters.Add("@UserName", UserName);
            parameters.Add("@Email", Email);
            parameters.Add("@Password", Password);
            parameters.Add("@Position", Position);
            parameters.Add("@MobileNumber", MobileNumber);

            return parameters;
        }

        public DynamicParameters GetParam_LoginCheck()
        {
            var parameters = new DynamicParameters();
            parameters.Add("@TenantID", TenantID);
            parameters.Add("@Email", Email);
            parameters.Add("@Password", Password);

            return parameters;
        }

        public DynamicParameters GetParam_MemberSelect()
        {
            var parameters = new DynamicParameters();
            parameters.Add("@TenantID", TenantID);
            parameters.Add("@UserName", UserName);

            return parameters;
        }
        public DynamicParameters GetParam_MemberProcess()
        {
            var parameters = new DynamicParameters();
            parameters.Add("@Database", "ScheduleKanri" + "_" + TenantID);
            parameters.Add("@UserID", UserID);
            parameters.Add("@UserName", UserName);
            parameters.Add("@Email", Email);
            parameters.Add("@Password", Password);
            parameters.Add("@Position", Position);
            parameters.Add("@MobileNo", MobileNumber);
            parameters.Add("@ProfileImage", ProfileImage);
            parameters.Add("@UserRole", UserRole);
            parameters.Add("@Mode", Mode);
            parameters.Add("@CreatedBy", CreatedBy);

            return parameters;
        }
    }
}
