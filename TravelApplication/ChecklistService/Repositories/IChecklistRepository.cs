using ChecklistService.Models;

namespace ChecklistService.Repositories
{
    public interface IChecklistRepository
    {
        Task<ChecklistItem> AddItemAsync(ChecklistItem item);
        Task<IEnumerable<ChecklistItem>> GetItemsByPlanIdAsync(Guid travelPlanId);
        Task<ChecklistItem?> GetItemByIdAsync(Guid id);
        Task<bool> UpdateItemStatusAsync(Guid id, bool isPacked);
        Task<bool> DeleteItemAsync(Guid id);
    }
}
