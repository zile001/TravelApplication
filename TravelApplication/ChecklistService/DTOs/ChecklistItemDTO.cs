namespace ChecklistService.DTOs
{
    public class ChecklistItemDTO
    {
        public Guid Id { get; set; }
        public Guid TravelPlanId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public bool IsPacked { get; set; }
    }
}
