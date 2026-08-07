namespace FinanceService.DTOs
{
    public class FinanceSummaryDTO
    {
        public Guid TravelPlanId { get; set; }
        public decimal TotalSpent { get; set; }
        public System.Collections.Generic.Dictionary<string, decimal> SpentByCategory { get; set; }
            = new System.Collections.Generic.Dictionary<string, decimal>();
    }
}
