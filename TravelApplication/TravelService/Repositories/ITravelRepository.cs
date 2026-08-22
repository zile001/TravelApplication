using TravelService.Models;

namespace TravelService.Repositories
{
    public interface ITravelRepository
    {
        //Upravljanje planovima
        Task<IEnumerable<TravelPlan>> GetAllPlansAsync();
        Task<TravelPlan> CreatePlanAsync(TravelPlan plan);
        Task<TravelPlan?> GetPlanByIdAsync(Guid id);
        Task<IEnumerable<TravelPlan>> GetAllPlansByUserIdAsync(int userId);
        Task<TravelPlan> UpdatePlanAsync(TravelPlan plan);
        Task<bool> DeletePlanAsync(Guid id);

        //Destinacije i aktivnosti se azuriraju kroz centralni plan radi kaskadnog efekta
        Task<IEnumerable<Destination>> GetDestinationsByPlanIdAsync(Guid planId);
        Task<Destination?> GetDestinationByIdAsync(Guid planId, Guid destinationId);
        Task<bool> AddDestinationAsync(Guid planId, Destination destination);
        Task<bool> UpdateDestinationAsync(Guid planId, Destination destination);
        Task<bool> DeleteDestinationAsync(Guid planId, Guid destinationId);

        Task<IEnumerable<Activity>> GetActivitiesByPlanIdAsync(Guid planId);
        Task<Activity?> GetActivityByIdAsync(Guid planId, Guid activityId);
        Task<bool> AddActivityAsync(Guid planId, Activity activity);
        Task<bool> UpdateActivityAsync(Guid planId, Activity activity);
        Task<bool> DeleteActivityAsync(Guid planId, Guid activityId);
    }
}
