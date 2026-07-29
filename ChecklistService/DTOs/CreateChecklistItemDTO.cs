using System.ComponentModel.DataAnnotations;

namespace ChecklistService.DTOs
{
    public class CreateChecklistItemDTO
    {
        [Required(ErrorMessage = "Plan putovanja je obavezan.")]
        public Guid TravelPlanId { get; set; }

        [Required(ErrorMessage = "Naziv stavke je obavezan.")]
        public string Title { get; set; } = string.Empty;

        public string Category { get; set; } = "Opšte";
    }
}
