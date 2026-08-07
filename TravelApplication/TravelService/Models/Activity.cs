namespace TravelService.Models
{
    public class Activity
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public TimeSpan Time { get; set; } // Vreme obilska/aktivnosti
        public string Location { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal EstimatedCost { get; set; }
        public ActivityStatus Status { get; set; } = ActivityStatus.Planirano;
    }
}
