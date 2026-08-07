namespace ChecklistService.Models
{
    public class ChecklistItem
    {
        public Guid Id { get; set; }
        public Guid TravelPlanId { get; set; }
        public int UserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Category { get; set; } = "Opste";
        public bool IsPacked { get; set; } = false;
    }
}
