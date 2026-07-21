using FinanceService.Models;

namespace FinanceService.DTOs
{
    public class ExpenseDTO
    {
        public Guid Id { get; set; }
        public Guid TravelPlanId { get; set; }
        public string Title { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = string.Empty;
        public ExpenseCategory Category { get; set; }
        public DateTime Date { get; set; }
    }
}
