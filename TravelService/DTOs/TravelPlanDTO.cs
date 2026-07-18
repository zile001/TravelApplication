namespace TravelService.DTOs
{
    public class TravelPlanDTO
    {
        public Guid Id { get; set; }
        public int UserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Budget { get; set; }
        public string GeneralNotes { get; set; } = string.Empty;

        public List<DestinationDto> Destinations { get; set; } = new List<DestinationDto>();
        public List<ActivityDto> Activities { get; set; } = new List<ActivityDto>();
    }
}
