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
            return await _stateManager.GetOrAddAsync<IReliableDictionary<Guid, TravelPlan>>(DictionaryName);
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
                        if (enumerator.Current.Value.UserId == userId)
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

        public async Task<IEnumerable<Destination>> GetDestinationsByPlanIdAsync(Guid planId)
        {
            var plan = await GetPlanByIdAsync(planId);
            if (plan == null || plan.Destinations == null) return Enumerable.Empty<Destination>();

            return plan.Destinations.OrderBy(d => d.ArrivalDate);
        }

        public async Task<Destination?> GetDestinationByIdAsync(Guid planId, Guid destinationId)
        {
            var plan = await GetPlanByIdAsync(planId);
            if (plan == null || plan.Destinations == null) return null;

            return plan.Destinations.FirstOrDefault(d => d.Id == destinationId);
        }

        public async Task<bool> UpdateDestinationAsync(Guid planId, Destination destination)
        {
            var plan = await GetPlanByIdAsync(planId);
            if (plan == null || plan.Destinations == null) return false;

            var index = plan.Destinations.FindIndex(d => d.Id == destination.Id);
            if (index == -1) return false;

            plan.Destinations[index] = destination;
            await UpdatePlanAsync(plan);
            return true;
        }

        public async Task<bool> AddDestinationAsync(Guid planId, Destination destination)
        {
            //var plan = await GetPlanByIdAsync(planId);
            //if (plan == null) return false;

            //plan.Destinations.Add(destination);
            //await UpdatePlanAsync(plan);
            //return true;
            var plansDict = await GetDictionaryAsync();

            using (var tx = _stateManager.CreateTransaction())
            {
                // 1. Čitamo plan iz rečnika SA zaključavanjem za azuriranje (Update lock)
                var result = await plansDict.TryGetValueAsync(tx, planId, LockMode.Update);
                if (!result.HasValue)
                {
                    return false; // Plan ne postoji
                }

                var plan = result.Value;

                // 2. Osiguravamo da lista postoji i dodajemo novu destinaciju
                plan.Destinations ??= new List<Destination>();
                plan.Destinations.Add(destination);

                // 3. EKSPLICITNO upisujemo osveženi objekat nazad u rečnik pod istim ključem!
                // Bez ovoga, Service Fabric NE ZNA da se lista unutar objekta promenila!
                await plansDict.SetAsync(tx, planId, plan);

                // 4. Trajno potvrdjujemo transakciju (zapis na disk i replike)
                await tx.CommitAsync();
                return true;
            }
        }

        public async Task<bool> DeleteDestinationAsync(Guid planId, Guid destinationId)
        {
            var plan = await GetPlanByIdAsync(planId);
            if (plan == null) return false;

            var destination = plan.Destinations.FirstOrDefault(d => d.Id == destinationId);
            if (destination == null) return false;

            plan.Destinations.Remove(destination);
            await UpdatePlanAsync(plan);
            return true;
        }
    

        public async Task<IEnumerable<Activity>> GetActivitiesByPlanIdAsync(Guid travelPlanId)
        {
            var plan = await GetPlanByIdAsync(travelPlanId);
            if (plan == null || plan.Activities == null)
                return Enumerable.Empty<Activity>();
            return plan.Activities
                .OrderBy(a => a.Date)
                .ThenBy(a => a.Time);
        }

        public async Task<Activity?> GetActivityByIdAsync(Guid planId,Guid id)
        {
            var plan = await GetPlanByIdAsync(planId);
            if(plan == null || plan.Activities == null) return null;

            return plan.Activities.FirstOrDefault(a => a.Id == id);
        }

        public async Task<bool> AddActivityAsync(Guid planId, Activity activity)
        {
            var plansDict = await GetDictionaryAsync();

            using (var tx = _stateManager.CreateTransaction())
            {
                // 1. Čitamo plan iz rečnika SA zaključavanjem za ažuriranje (Update lock)
                var result = await plansDict.TryGetValueAsync(tx, planId, LockMode.Update);
                if (!result.HasValue)
                {
                    return false; // Plan ne postoji
                }

                var plan = result.Value;

                // 2. Osiguravamo da lista aktivnosti postoji i dodajemo novu aktivnost
                plan.Activities ??= new List<Activity>();
                plan.Activities.Add(activity);

                // 3. Eksplicitno upisujemo osveženi objekat nazad u rečnik
                await plansDict.SetAsync(tx, planId, plan);

                // 4. Trajno potvrđujemo transakciju (zapis na disk i replike)
                await tx.CommitAsync();
                return true;
            }
        }

        public async Task<bool> UpdateActivityAsync(Guid planId, Activity activity)
        {
            var plan = await GetPlanByIdAsync(planId);
            if (plan == null || plan.Activities == null) return false;

            var index = plan.Activities.FindIndex(a => a.Id == activity.Id);
            if (index == -1) return false;

            plan.Activities[index] = activity;
            await UpdatePlanAsync(plan);
            return true;
        }

        public async Task<bool> DeleteActivityAsync(Guid planId, Guid id)
        {
            var plan = await GetPlanByIdAsync(planId);
            if (plan == null || plan.Activities == null) return false;

            var activity = plan.Activities.FirstOrDefault(a => a.Id == id);
            if (activity == null) return false;

            plan.Activities.Remove(activity);
            await UpdatePlanAsync(plan);
            return true;
        }

        
    }
}
