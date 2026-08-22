namespace FinanceService.Models
{
    public class Expense
    {
        public Guid Id { get; set; }
        public Guid TravelPlanId { get; set; }
        public int UserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public ExpenseCategory Category { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; } = string.Empty;
    }
}
