using FinanceService.Models;
using System.ComponentModel.DataAnnotations;

namespace FinanceService.DTOs
{
    public class CreateExpenseDTO
    {
        [Required(ErrorMessage = "Plan putovanja je obavezan")]
        public Guid TravelPlanId { get; set; }

        [Required(ErrorMessage = "Naziv troska je obavezan")]
        public string Title { get; set; } = string.Empty;

        [Range(0.01, double.MaxValue, ErrorMessage = "Iznos mora biti veci od 0")]
        public decimal Amount { get; set; }

        public string Currency { get; set; } = string.Empty;
        public ExpenseCategory Category { get; set; }
        public DateTime Date {  get; set; } = DateTime.UtcNow;
    }
}
