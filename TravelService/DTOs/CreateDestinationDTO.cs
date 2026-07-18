using System.ComponentModel.DataAnnotations;

namespace TravelService.DTOs
{
    public class CreateDestinationDTO
    {
        [Required(ErrorMessage = "Naziv destinacije je obavezan.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Lokacija je obavezna.")]
        public string Location { get; set; } = string.Empty;

        [Required(ErrorMessage = "Datum dolaska je obavezan.")]
        public DateTime ArrivalDate { get; set; }

        [Required(ErrorMessage = "Datum odlaska je obavezan.")]
        public DateTime DepartureDate { get; set; }

        public string Notes { get; set; } = string.Empty;
    }
}
