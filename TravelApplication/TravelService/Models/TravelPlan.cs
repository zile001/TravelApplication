using System.Diagnostics;
using System.Runtime.Serialization;

namespace TravelService.Models
{
    [DataContract]
    public class TravelPlan
    {
        [DataMember]
        public Guid Id { get; set; }
        [DataMember]
        public int UserId { get; set; }
        [DataMember]
        public string Title { get; set; } = string.Empty;
        [DataMember]
        public string Description { get; set; } = string.Empty;
        [DataMember]
        public DateTime StartDate { get; set; }
        [DataMember]
        public DateTime EndDate { get; set; }
        [DataMember]
        public decimal Budget { get; set; }
        [DataMember]
        public string GeneralNotes { get; set; } = string.Empty;
        [DataMember]

        public List<Destination> Destinations { get; set; } = new List<Destination>();
        [DataMember]
        public List<Activity> Activities { get; set; } = new List<Activity>();
    }
}
