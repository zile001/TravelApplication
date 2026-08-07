using ChecklistService.Models;
using Microsoft.EntityFrameworkCore;

namespace ChecklistService.Repositories
{
    public class ChecklistRepository : IChecklistRepository
    {
        private readonly ChecklistDbContext _context;

        public ChecklistRepository(ChecklistDbContext context)
        {
            _context = context;
        }       

        public async Task<ChecklistItem> AddItemAsync(ChecklistItem item)
        {
            await _context.ChecklistItems.AddAsync(item);
            await _context.SaveChangesAsync();
            return item;
        }

        public async Task<bool> DeleteItemAsync(Guid id)
        {
            var item = await _context.ChecklistItems.FindAsync(id);
            if (item == null) return false;

            _context.ChecklistItems.Remove(item);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<ChecklistItem?> GetItemByIdAsync(Guid id)
        {
            return await _context.ChecklistItems.FindAsync(id);
        }

        public async Task<IEnumerable<ChecklistItem>> GetItemsByPlanIdAsync(Guid travelPlanId)
        {
            return await _context.ChecklistItems.Where(x => x.TravelPlanId == travelPlanId)
                .ToListAsync();
        }

        public async Task<bool> UpdateItemStatusAsync(Guid id, bool isPacked)
        {
            var item = await _context.ChecklistItems.FindAsync(id);
            if (item == null) return false;
            
            item.IsPacked = isPacked;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
