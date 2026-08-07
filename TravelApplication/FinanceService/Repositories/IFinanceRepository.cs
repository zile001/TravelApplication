using FinanceService.Models;

namespace FinanceService.Repositories
{
    public interface IFinanceRepository
    {
        Task<Expense> AddExpenseAsync(Expense expense);
        Task<IEnumerable<Expense>> GetAllExpensesByPlanIdAsync(Guid travelPlanId);
        Task<Expense?> GetExpenseByIdAsync(Guid id);
        Task<bool> DeleteExpenseAsync(Guid id);
    }
}
