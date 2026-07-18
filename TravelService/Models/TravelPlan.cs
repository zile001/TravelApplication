using System.Diagnostics;

namespace TravelService.Models
{
    public class TravelPlan
    {
        public Guid Id { get; set; }
        public int UserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Budget { get; set; }
        public string GeneralNotes { get; set; } = string.Empty;

        public List<Destination> Destinations { get; set; } = new List<Destination>();
        public List<Activity> Activities { get; set; } = new List<Activity>();
    }
}
