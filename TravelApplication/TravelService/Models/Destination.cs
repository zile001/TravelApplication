using System.Runtime.Serialization;

namespace TravelService.Models
{
    [DataContract]
    public class Destination
    {
        [DataMember]
        public Guid Id { get; set; }
        [DataMember]
        public string Name { get; set; } = string.Empty;
        [DataMember]
        public string Location { get; set; } = string.Empty;
        [DataMember]
        public DateTime ArrivalDate { get; set; }
        [DataMember]
        public DateTime DepartureDate { get; set; }
        [DataMember(IsRequired = false)]
        public string Notes { get; set; } = string.Empty;
    }
}
