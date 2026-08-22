using System.Runtime.Serialization;

namespace TravelService.Models
{
    [DataContract]
    public class Activity
    {
        [DataMember]
        public Guid Id { get; set; }
        [DataMember]
        public Guid TravelPlanId { get; set; }
        [DataMember]
        public string Title { get; set; } = string.Empty;
        [DataMember]
        public DateTime Date { get; set; }
        [DataMember]
        public TimeSpan Time { get; set; } // Vreme obilska/aktivnosti
        [DataMember]
        public string Location { get; set; } = string.Empty;
        [DataMember]
        public string Description { get; set; } = string.Empty;
        [DataMember]
        public decimal EstimatedCost { get; set; }
        [DataMember]
        public ActivityStatus Status { get; set; } = ActivityStatus.Planirano;
    }
}
