using System.ComponentModel.DataAnnotations;

namespace TravelService.DTOs
{
    public class CreateTravelPlanDTO
    {
        [Required(ErrorMessage = "Naziv putovanja je obavezan.")]
        [StringLength(100, ErrorMessage = "Naziv ne može biti duži od 100 karaktera.")]
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Početni datum je obavezan.")]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage = "Krajnji datum je obavezan.")]
        public DateTime EndDate { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Budžet ne može imati negativnu vrijednost.")]
        public decimal Budget { get; set; }

        public string GeneralNotes { get; set; } = string.Empty;
    }
}
