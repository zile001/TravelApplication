using Microsoft.EntityFrameworkCore;
using Microsoft.ServiceFabric.Data;
using Microsoft.ServiceFabric.Data.Collections;
using TravelService.Models;

namespace TravelService.Repositories
{
    public class TravelRepository : ITravelRepository
    {
       private readonly TravelDbContext _context;

        public TravelRepository(TravelDbContext context)
        {
            _context = context;
        }
     

        public async Task<TravelPlan> CreatePlanAsync(TravelPlan plan)
        {
            if (plan.Id == Guid.Empty)
            {
                plan.Id = Guid.NewGuid();
            }
            await _context.TravelPlans.AddAsync(plan);
            await _context.SaveChangesAsync();          
            return plan;
        }

        public async Task<IEnumerable<TravelPlan>> GetAllPlansAsync()
        {
            return await _context.TravelPlans
                .Include(p => p.Destinations)
                .Include(p => p.Activities)
                .AsNoTracking()
                .ToListAsync();
        }
        public async Task<TravelPlan?> GetPlanByIdAsync(Guid id)
        {
            return await _context.TravelPlans
                 .Include(p => p.Destinations)
                 .Include(p => p.Activities)
                 .AsNoTracking()
                 .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<TravelPlan>> GetAllPlansByUserIdAsync(int userId)
        {
            return await _context.TravelPlans
                .Include(p => p.Destinations)
                .Include(p => p.Activities)
                .Where(p => p.UserId == userId)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<TravelPlan> UpdatePlanAsync(TravelPlan plan)
        {
            var existingPlan = await _context.TravelPlans.FindAsync(plan.Id);
            if (existingPlan == null) return null;

            existingPlan.Title = plan.Title;
            existingPlan.Description = plan.Description;
            existingPlan.StartDate = plan.StartDate;
            existingPlan.EndDate = plan.EndDate;
            existingPlan.Budget = plan.Budget;
            existingPlan.GeneralNotes = plan.GeneralNotes;

            await _context.SaveChangesAsync();
            return existingPlan;
        }

        public async Task<bool> DeletePlanAsync(Guid id)
        {
            var plan = await _context.TravelPlans.FindAsync(id);
            if (plan == null) return false;

            _context.TravelPlans.Remove(plan);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Destination>> GetDestinationsByPlanIdAsync(Guid planId)
        {
            return await _context.Destinations
                 .Where(d => d.TravelPlanId == planId)
                 .OrderBy(d => d.ArrivalDate)
                 .AsNoTracking()
                 .ToListAsync();
        }

        public async Task<Destination?> GetDestinationByIdAsync(Guid planId, Guid destinationId)
        {
            return await _context.Destinations
                 .AsNoTracking()
                 .FirstOrDefaultAsync(d => d.TravelPlanId == planId && d.Id == destinationId);
        }

        public async Task<bool> UpdateDestinationAsync(Guid planId, Destination destination)
        {
            var existingDestination = await _context.Destinations
                 .FirstOrDefaultAsync(d => d.TravelPlanId == planId && d.Id == destination.Id);

            if (existingDestination == null) return false;

            existingDestination.Name = destination.Name;
            existingDestination.Location = destination.Location;
            existingDestination.ArrivalDate = destination.ArrivalDate;
            existingDestination.DepartureDate = destination.DepartureDate;
            existingDestination.Notes = destination.Notes;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AddDestinationAsync(Guid planId, Destination destination)
        {
            var planExists = await _context.TravelPlans.AnyAsync(p => p.Id == planId);
            if (!planExists) return false;

            if (destination.Id == Guid.Empty)
            {
                destination.Id = Guid.NewGuid();
            }

            destination.TravelPlanId = planId;
            await _context.Destinations.AddAsync(destination);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteDestinationAsync(Guid planId, Guid destinationId)
        {
            var destination = await _context.Destinations
                .FirstOrDefaultAsync(d => d.TravelPlanId == planId && d.Id == destinationId);

            if (destination == null) return false;

            _context.Destinations.Remove(destination);
            await _context.SaveChangesAsync();
            return true;
        }
    

        public async Task<IEnumerable<Activity>> GetActivitiesByPlanIdAsync(Guid travelPlanId)
        {
            return await _context.Activities
                 .Where(a => a.TravelPlanId == travelPlanId)
                 .OrderBy(a => a.Date)
                 .ThenBy(a => a.Time)
                 .AsNoTracking()
                 .ToListAsync();
        }

        public async Task<Activity?> GetActivityByIdAsync(Guid planId,Guid id)
        {
            return await _context.Activities
                .AsNoTracking()
                .FirstOrDefaultAsync(a => a.TravelPlanId == planId && a.Id == id);
        }

        public async Task<bool> AddActivityAsync(Guid planId, Activity activity)
        {
            var planExists = await _context.TravelPlans.AnyAsync(p => p.Id == planId);
            if (!planExists) return false;

            if (activity.Id == Guid.Empty)
            {
                activity.Id = Guid.NewGuid();
            }

            activity.TravelPlanId = planId;
            await _context.Activities.AddAsync(activity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateActivityAsync(Guid planId, Activity activity)
        {
            var existingActivity = await _context.Activities
                 .FirstOrDefaultAsync(a => a.TravelPlanId == planId && a.Id == activity.Id);

            if (existingActivity == null) return false;

            existingActivity.Title = activity.Title;
            existingActivity.Description = activity.Description;
            existingActivity.Date = activity.Date;
            existingActivity.Time = activity.Time;
            existingActivity.Location = activity.Location;
            existingActivity.EstimatedCost = activity.EstimatedCost;
            existingActivity.Status = activity.Status;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteActivityAsync(Guid planId, Guid id)
        {
            var activity = await _context.Activities
                .FirstOrDefaultAsync(a => a.TravelPlanId == planId && a.Id == id);

            if (activity == null) return false;

            _context.Activities.Remove(activity);
            await _context.SaveChangesAsync();
            return true;
        }

        
    }
}
