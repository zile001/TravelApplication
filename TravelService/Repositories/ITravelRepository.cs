using TravelService.Models;

namespace TravelService.Repositories
{
    public interface ITravelRepository
    {
        //Upravljanje planovima
        Task<TravelPlan> CreatePlanAsync(TravelPlan plan);
        Task<TravelPlan> GetPlanByIdAsync(Guid id);
        Task<IEnumerable<TravelPlan>> GetAllPlansByUserIdAsync(int userId);
        Task<TravelPlan> UpdatePlanAsync(TravelPlan plan);
        Task<bool> DeletePlanAsync(Guid id);

        //Destinacije i aktivnosti se azuriraju kroz centralni plan radi kaskadnog efekta
        Task<bool> AddDestinationAsync(Guid planId, Destination destination);
        Task<bool> DeleteDestinationAsync(Guid planId, Guid destinationId);

        Task<bool> AddActivityAsync(Guid planId, Activity activity);
        Task<bool> UpdateActivityStatusAsync(Guid planId, Guid activityId, ActivityStatus status);
        Task<bool> DeleteActivityAsync(Guid planId, Guid activityId);
    }
}
