using ScheduleKanriSystem.Models;

namespace ScheduleKanriSystem.Data
{
    public interface IGenericRepository<T> where T : BaseModel
    {
        Task<ApiResponseModel> ExecAsync(string storeProc, object param, bool useTransaction);
    }
}
