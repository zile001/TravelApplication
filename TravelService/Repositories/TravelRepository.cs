using Microsoft.ServiceFabric.Data;
using Microsoft.ServiceFabric.Data.Collections;
using Microsoft.VisualBasic;
using TravelService.Models;

namespace TravelService.Repositories
{
    public class TravelRepository : ITravelRepository
    {
        private readonly IReliableStateManager _stateManager;
        private const string DictionaryName = "TravelPlansDictionary";

        public TravelRepository(IReliableStateManager stateManager)
        {
            _stateManager = stateManager;
        }

        //Pomocna metoda za dobijanje ili kreiranje recnika
        private async Task<IReliableDictionary<Guid, TravelPlan>> GetDictionaryAsync()
        {
            return await _stateManager.GetOrAddAsync<IReliableDictionary<Guid,TravelPlan>>(DictionaryName);
        }

        public async Task<TravelPlan> CreatePlanAsync(TravelPlan plan)
        {
            var dict = await GetDictionaryAsync();
            using (var tx = _stateManager.CreateTransaction())
            {

                await dict.TryAddAsync(tx, plan.Id, plan);
                await tx.CommitAsync();
            }
            return plan;
        }

        public async Task<TravelPlan> GetPlanByIdAsync(Guid id)
        {
            var dict = await GetDictionaryAsync();
            using (var tx = _stateManager.CreateTransaction())
            {
                var result = await dict.TryGetValueAsync(tx, id);
                return result.HasValue ? result.Value : null;
            }
        }

        public async Task<IEnumerable<TravelPlan>> GetAllPlansByUserIdAsync(int userId)
        {
            var dict = await GetDictionaryAsync();
            var plansList = new List<TravelPlan>();

            using (var tx = _stateManager.CreateTransaction())
            {
                var enumerable = await dict.CreateEnumerableAsync(tx);
                using (var enumerator = enumerable.GetAsyncEnumerator())
                {
                    while (await enumerator.MoveNextAsync(default))
                    {
                        if(enumerator.Current.Value.UserId == userId)
                        {
                            plansList.Add(enumerator.Current.Value);
                        }
                    }
                }
            }
            return plansList;
        }

        public async Task<TravelPlan> UpdatePlanAsync(TravelPlan plan)
        {
            var dict = await GetDictionaryAsync();
            using (var tx = _stateManager.CreateTransaction())
            {
                await dict.SetAsync(tx, plan.Id, plan);
                await tx.CommitAsync();
            }
            return plan;
        }

        public async Task<bool> DeletePlanAsync(Guid id)
        {
            var dict = await GetDictionaryAsync();
            using (var tx = _stateManager.CreateTransaction())
            {
                var result = await dict.TryRemoveAsync(tx, id);
                await tx.CommitAsync();
                return result.HasValue;
            }
        }

        public async Task<bool> AddDestinationAsync(Guid planId, Destination destination)
        {
            var plan = await GetPlanByIdAsync(planId);
            if (plan == null) return false;

            plan.Destinations.Add(destination);
            await UpdatePlanAsync(plan);
            return true;
        }

        public async Task<bool> DeleteDestinationAsync(Guid planId, Guid destinationId)
        {
            var plan = await GetPlanByIdAsync(planId);
            if (plan == null) return false;

            var destination = plan.Destinations.FirstOrDefault(d => d.Id == destinationId);
            if(destination == null) return false;

            plan.Destinations.Remove(destination);
            await UpdatePlanAsync(plan);
            return true;
        }

        public async Task<bool> AddActivityAsync(Guid planId, Activity activity)
        {
            var plan = await GetPlanByIdAsync(planId);
            if (plan == null) return false;

            plan.Activities.Add(activity);
            await UpdatePlanAsync(plan);
            return true;
        }

        public async Task<bool> UpdateActivityStatusAsync(Guid planId, Guid activityId, ActivityStatus status)
        {
            var plan = await GetPlanByIdAsync(planId);
            if (plan == null) return false;

            var activity = plan.Activities.FirstOrDefault(a => a.Id == activityId);
            if(activity == null) return false;

            activity.Status = status;
            await UpdatePlanAsync(plan);
            return true;
        }

        public async Task<bool> DeleteActivityAsync(Guid planId, Guid activityId)
        {
            var plan = await GetPlanByIdAsync(planId);
            if (plan == null) return false;

            var activity = plan.Activities.FirstOrDefault(a => a.Id == activityId);
            if (activity == null) return false;

            plan.Activities.Remove(activity);
            await UpdatePlanAsync(plan);
            return true;
        }
    }
}
