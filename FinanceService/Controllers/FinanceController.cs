using FinanceService.DTOs;
using FinanceService.Models;
using FinanceService.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
using System.Security.Claims;

namespace FinanceService.Controllers
{
    [ApiController]
    [Route("api/finance")]
    public class FinanceController : ControllerBase
    {
        private readonly IFinanceRepository _financeRepository;

        public FinanceController(IFinanceRepository repository)
        {
            _financeRepository = repository;
        }

        private int GetCurrentUserId()
        {
            var nameIdentifier = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if(string.IsNullOrEmpty(nameIdentifier) && User.Identity is ClaimsIdentity identity)
            {
                nameIdentifier = identity.FindFirst("id")?.Value ?? identity.FindFirst("sub")?.Value;
            }
            return int.TryParse(nameIdentifier, out var userId) ? userId : 0;
        }

        [HttpPost("expenses")]
        public async Task<IActionResult> AddExpense([FromBody] CreateExpenseDTO dto)
        {
            int userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized(new { Message = "Nevazeci korisnicki token" });

            var newExpense = new Expense
            {
                Id = Guid.NewGuid(),
                TravelPlanId = dto.TravelPlanId,
                UserId = userId,
                Title = dto.Title,
                Amount = dto.Amount,
                Currency = string.IsNullOrWhiteSpace(dto.Currency) ? "EUR" : dto.Currency,
                Category = dto.Category,
                Date = dto.Date
            };

            await _financeRepository.AddExpenseAsync(newExpense);

            var resultDto = MapToDto(newExpense);
            return CreatedAtAction(nameof(GetExpenseById), new { id = resultDto.Id });

        }

        [HttpGet("expenses/{id}")]
        public async Task<IActionResult> GetExpenseById(Guid id)
        {
            var expense = await _financeRepository.GetExpenseByIdAsync(id);
            if(expense == null) return NotFound(new {Message = "Trosak nije pronadjen"});

            return Ok(MapToDto(expense));
        }

        [HttpDelete("expenses/{id}")]
        public async Task<IActionResult> DeleteExpense(Guid id)
        {
            var uspesno = await _financeRepository.DeleteExpenseAsync(id);
            if (!uspesno) return NotFound(new { Message = "Trosak ne postoji" });

            return Ok(new { Message = "Trosak uspesno obrisan" });
        }

        [HttpGet("plans/{travelPlanId}/summary")]
        public async Task<IActionResult> GetFinanceSummary(Guid travelPlanId)
        {
            var expenses = (await _financeRepository.GetAllExpensesByPlanIdAsync(travelPlanId)).ToList();

            decimal totalSpent = expenses.Sum(e => e.Amount);

            var spentByCategory = expenses
                .GroupBy(e => e.Category.ToString())
                .ToDictionary(
                    g => g.Key,
                    g => g.Sum(e => e.Amount)
                );

            var summary = new FinanceSummaryDTO
            {
                TravelPlanId = travelPlanId,
                TotalSpent = totalSpent,
                SpentByCategory = spentByCategory
            };

            return Ok(summary);
        }

        private static ExpenseDTO MapToDto(Expense expense)
        {
            return new ExpenseDTO
            {
                Id = expense.Id,
                TravelPlanId = expense.TravelPlanId,
                Title = expense.Title,
                Amount = expense.Amount,
                Currency = expense.Currency,
                Category = expense.Category,
                Date = expense.Date
            };
        }
    }
}
