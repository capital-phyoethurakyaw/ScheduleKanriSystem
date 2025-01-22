using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ScheduleKanriSystem.Data;
using ScheduleKanriSystem.Models;
using ScheduleKanriSystem.Utilities;

namespace ScheduleKanriSystem.Controllers
{
    [Route("/api/dutyplan/")]
    [ApiController]
    public class DutyPlanApiController(IGenericRepository<DutyPlanModel> repo) : ControllerBase
    {

        private readonly IGenericRepository<DutyPlanModel> _dutyplanRepo = repo;

        [Authorize]
        [HttpPost("getdutyplan")]
        public async Task<ActionResult<IReadOnlyList<ApiResponseModel>>> DutyPlanSelect(DutyPlanModel dutyPlan)
        {
            var parameters = dutyPlan.GetParam_DutyPlanSelect();
            ApiResponseModel response = await _dutyplanRepo.ExecAsync("DutyPlan_Select", parameters, false);

            return Ok(response);
        }

        [Authorize]
        [HttpPost("dutyplanprocess")]
        public async Task<ActionResult<IReadOnlyList<ApiResponseModel>>> DutyPlanProcess(DutyPlanModel dutyPlan)
        {
            var parameters = dutyPlan.GetParam_DutyPlanProcess();
            ApiResponseModel response = await _dutyplanRepo.ExecAsync("DutyPlan_Process", parameters, false);

            return Ok(response);
        }

        //private readonly IGenericRepository<MemberModel> _memberRepo = repo;
        //[Authorize]
        //[HttpPost("getdaysofMonth")]
        //public async Task<ActionResult<IReadOnlyList<ApiResponseModel>>> GetdaysofMonth()
        //{
        //   // var parameters = member.GetParam_MemberSelect();
        //    ApiResponseModel response = await GetDaysAsync(  );

        //    return Ok(response);
        //}

        //private async Task<ApiResponseModel> GetDaysAsync( )
        //{
        //    int year = 2025;
        //    int month = 2;

        //    int daysInMonth = DateTime.DaysInMonth(year, month);

        //    string[] japaneseDayNames = { "日", "月", "火", "水", "木", "金", "土" };



        //    await Task.Delay(1);

        //    var daysList = new List<DutyPlanModel>();

        //    DutyPlanModel dpHeader1 = new DutyPlanModel();
        //    dpHeader1.UserProfile = null;
        //    dpHeader1.Name_Role = null;
        //    dpHeader1.MultiDate = null;

        //    DutyPlanModel dpHeader2 = new DutyPlanModel();
        //    dpHeader2.UserProfile = null;
        //    dpHeader2.Name_Role = "Member";
        //    dpHeader2.MultiDate = null;

        //    for (int day = 1; day <= daysInMonth; day++)
        //    {
        //        DateTime date = new DateTime(year, month, day);
        //        int dayOfWeekIndex = (int)date.DayOfWeek;
        //        if (day == 1)
        //        {
        //            dpHeader1.Day_1 = japaneseDayNames[dayOfWeekIndex];
        //            dpHeader2.Day_1 = day.ToString();
        //            continue;
        //        }
        //        if (day == 2)
        //        {
        //            dpHeader1.Day_2 = japaneseDayNames[dayOfWeekIndex];
        //            dpHeader2.Day_2 = day.ToString();
        //            continue;
        //        }
        //        if (day == 3)
        //        {
        //            dpHeader1.Day_3 = japaneseDayNames[dayOfWeekIndex];
        //            dpHeader2.Day_3 = day.ToString();
        //            continue;
        //        }
        //        if (day == 4)
        //        {
        //            dpHeader1.Day_4 = japaneseDayNames[dayOfWeekIndex];
        //            dpHeader2.Day_4 = day.ToString();
        //            continue;
        //        }
        //        if (day == 5)
        //        {
        //            dpHeader1.Day_5 = japaneseDayNames[dayOfWeekIndex];
        //            dpHeader2.Day_5 = day.ToString();
        //            continue;
        //        }
        //        if (day == 6)
        //        {
        //            dpHeader1.Day_6 = japaneseDayNames[dayOfWeekIndex];
        //            dpHeader2.Day_6 = day.ToString();
        //            continue;
        //        }
        //        if (day == 7)
        //        {
        //            dpHeader1.Day_7 = japaneseDayNames[dayOfWeekIndex];
        //            dpHeader2.Day_7 = day.ToString();
        //            continue;
        //        }
        //        if (day == 8)
        //        {
        //            dpHeader1.Day_8 = japaneseDayNames[dayOfWeekIndex];
        //            dpHeader2.Day_8 = day.ToString();
        //            continue;
        //        }
        //        if (day == 9)
        //        {
        //            dpHeader1.Day_9 = japaneseDayNames[dayOfWeekIndex];
        //            dpHeader2.Day_9 = day.ToString();
        //            continue;
        //        }
        //        if (day == 10)
        //        {
        //            dpHeader1.Day_10 = japaneseDayNames[dayOfWeekIndex];
        //            dpHeader2.Day_10 = day.ToString();
        //            continue;
        //        }
        //        if (day == 11)
        //        {
        //            dpHeader1.Day_11 = japaneseDayNames[dayOfWeekIndex];
        //            dpHeader2.Day_11 = day.ToString();
        //            continue;
        //        }
        //        if (day == 12)
        //        {
        //            dpHeader1.Day_12 = japaneseDayNames[dayOfWeekIndex];
        //            dpHeader2.Day_12 = day.ToString();
        //            continue;
        //        }
        //        if (day == 13)
        //        {
        //            dpHeader1.Day_13 = japaneseDayNames[dayOfWeekIndex];
        //            dpHeader2.Day_13 = day.ToString();
        //            continue;
        //        }
        //        if (day == 14)
        //        {
        //            dpHeader1.Day_14 = japaneseDayNames[dayOfWeekIndex];
        //            dpHeader2.Day_14 = day.ToString();
        //            continue;
        //        }
        //        if (day == 15)
        //        {
        //            dpHeader1.Day_15 = japaneseDayNames[dayOfWeekIndex];
        //            dpHeader2.Day_15 = day.ToString();
        //            continue;
        //        }
        //        if (day == 16)
        //        {
        //            dpHeader1.Day_16 = japaneseDayNames[dayOfWeekIndex];
        //            dpHeader2.Day_16 = day.ToString();
        //            continue;
        //        }
        //        if (day == 17)
        //        {
        //            dpHeader1.Day_17 = japaneseDayNames[dayOfWeekIndex];
        //            dpHeader2.Day_17 = day.ToString();
        //            continue;
        //        }
        //        if (day == 18)
        //        {
        //            dpHeader1.Day_18 = japaneseDayNames[dayOfWeekIndex];
        //            dpHeader2.Day_18 = day.ToString();
        //            continue;
        //        }
        //        if (day == 19)
        //        {
        //            dpHeader1.Day_19 = japaneseDayNames[dayOfWeekIndex];
        //            dpHeader2.Day_19 = day.ToString();
        //            continue;
        //        }
        //        if (day == 20)
        //        {
        //            dpHeader1.Day_20 = japaneseDayNames[dayOfWeekIndex];
        //            dpHeader2.Day_20 = day.ToString();
        //            continue;
        //        }
        //        if (day == 21)
        //        {
        //            dpHeader1.Day_21 = japaneseDayNames[dayOfWeekIndex];
        //            dpHeader2.Day_21 = day.ToString();
        //            continue;
        //        }
        //        if (day == 22)
        //        {
        //            dpHeader1.Day_22 = japaneseDayNames[dayOfWeekIndex];
        //            dpHeader2.Day_22 = day.ToString();
        //            continue;
        //        }
        //        if (day == 23)
        //        {
        //            dpHeader1.Day_23 = japaneseDayNames[dayOfWeekIndex];
        //            dpHeader2.Day_23 = day.ToString();
        //            continue;
        //        }
        //        if (day == 24)
        //        {
        //            dpHeader1.Day_24 = japaneseDayNames[dayOfWeekIndex];
        //            dpHeader2.Day_24 = day.ToString();
        //            continue;
        //        }
        //        if (day == 25)
        //        {
        //            dpHeader1.Day_25 = japaneseDayNames[dayOfWeekIndex];
        //            dpHeader2.Day_25 = day.ToString();
        //            continue;
        //        }
        //        if (day == 26)
        //        {
        //            dpHeader1.Day_26 = japaneseDayNames[dayOfWeekIndex];
        //            dpHeader2.Day_26 = day.ToString();
        //            continue;
        //        }
        //        if (day == 27)
        //        {
        //            dpHeader1.Day_27 = japaneseDayNames[dayOfWeekIndex];
        //            dpHeader2.Day_27 = day.ToString();
        //            continue;
        //        }
        //        if (day == 28)
        //        {
        //            dpHeader1.Day_28 = japaneseDayNames[dayOfWeekIndex];
        //            dpHeader2.Day_28 = day.ToString();
        //            continue;
        //        }


        //        if (day == 29)
        //        {
        //            dpHeader1.Day_29 = japaneseDayNames[dayOfWeekIndex];
        //            dpHeader2.Day_29 = day.ToString();
        //            continue;
        //        }
        //        if (day == 30)
        //        {
        //            dpHeader1.Day_30 = japaneseDayNames[dayOfWeekIndex];
        //            dpHeader2.Day_30 = day.ToString();
        //            continue;
        //        }
        //        if (day == 31)
        //        {
        //            dpHeader1.Day_31 = japaneseDayNames[dayOfWeekIndex];
        //            dpHeader2.Day_31 = day.ToString();
        //            continue;
        //        }


        //    }


        //    daysList.Add(dpHeader1);
        //    daysList.Add(dpHeader2);



        //    return new ApiResponseModel
        //    {
        //        StatusCode = 200,
        //        Data = await SimulateQueryAsync(daysList) // Assign the list of days
        //    };
        //}
        //static Task<IEnumerable<T>> SimulateQueryAsync<T>(List<T> list)
        //{
        //    // Return the list as an IEnumerable wrapped in a Task
        //    return Task.FromResult(list.AsEnumerable());
        //}


    }
}
