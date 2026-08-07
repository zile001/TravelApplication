using FinanceService.Models;
using Microsoft.EntityFrameworkCore;

namespace FinanceService.Repositories
{
    public class FinanceRepository : IFinanceRepository
    {
        private readonly FinanceDbContext _context;

        public FinanceRepository(FinanceDbContext context)
        {
            _context = context;
        }
        public async Task<Expense> AddExpenseAsync(Expense expense)
        {
            await _context.Expenses.AddAsync(expense);
            await _context.SaveChangesAsync();
            return expense;
        }

        public async Task<bool> DeleteExpenseAsync(Guid id)
        {
            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null)
            {
                return false;
            }

            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Expense>> GetAllExpensesByPlanIdAsync(Guid travelPlanId)
        {
            return await _context.Expenses
                .Where(e => e.TravelPlanId == travelPlanId)
                .ToListAsync();
        }

        public async Task<Expense?> GetExpenseByIdAsync(Guid id)
        {
            return await _context.Expenses.FindAsync(id);
        }
    }
}
