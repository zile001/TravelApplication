using System.ComponentModel.DataAnnotations;
using TravelService.Models;

namespace TravelService.DTOs
{
    public class CreateActivityDTO
    {
        [Required(ErrorMessage = "Naziv aktivnosti je obavezan.")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Datum aktivnosti je obavezan.")]
        public DateTime Date { get; set; }

        [Required(ErrorMessage = "Vrijeme aktivnosti je obavezno.")]
        public TimeSpan Time { get; set; }

        [Required(ErrorMessage = "Lokacija je obavezna.")]
        public string Location { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [Range(0, double.MaxValue, ErrorMessage = "Procijenjeni trošak ne može biti negativan.")]
        public decimal EstimatedCost { get; set; }

        public string Status { get; set; } = string.Empty;
    }
}
