using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TravelService.DTOs;
using TravelService.Models;
using TravelService.Repositories;

namespace TravelService.Controllers
{
    [ApiController]
    [Route("api/travel")]
    public class TravelController : ControllerBase
    {
        private readonly ITravelRepository _travelRepository;

        public TravelController(ITravelRepository travelRepository)
        {
            _travelRepository = travelRepository;
        }

        private int GetCurrentUserId()
        {
            var nameIdentifier = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(nameIdentifier) && User.Identity is ClaimsIdentity identity)
            {
                nameIdentifier = identity.FindFirst("id")?.Value ?? identity.FindFirst("sub")?.Value;
            }
            return int.TryParse(nameIdentifier, out var userId) ? userId : 0;
        }

        [HttpPost("plans")]
        public async Task<IActionResult> CreatePlan([FromBody] CreateTravelPlanDTO dto)
        {
            if (dto.EndDate < dto.StartDate)
            {
                return BadRequest(new { Message = "Datum zavrsetka putovanja ne moze biti pre datuma pocetka" });
            }
            int userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized(new { Message = "Nevazeci korisnicki token" });

            var newPlan = new TravelPlan
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Title = dto.Title,
                Description = dto.Description,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Budget = dto.Budget,
                GeneralNotes = dto.GeneralNotes
            };

            var createdPlan = await _travelRepository.CreatePlanAsync(newPlan);

            var planDto = MapToPlanDto(createdPlan);
            return CreatedAtAction(nameof(GetPlanById), new {id = planDto.Id}, planDto);
        }

        [HttpGet("plans")]
        public async Task<IActionResult> GetAllPlans()
        {
            int userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized();

            var plans = await _travelRepository.GetAllPlansByUserIdAsync(userId);
            var plansDtos = plans.Select(MapToPlanDto);

            return Ok(plansDtos);
        }

        [HttpGet("plans/{id}")]
        public async Task<IActionResult> GetPlanById(Guid id)
        {
            var plan = await _travelRepository.GetPlanByIdAsync(id);
            if (plan == null) return NotFound(new {Message = "Plan putovanja nije pronadjen"});

            int userId = GetCurrentUserId();
            if (plan.UserId != userId) return Forbid();

            return Ok(MapToPlanDto(plan));
        }

        [HttpDelete("plans/{id}")]
        public async Task<IActionResult> DeletePlan(Guid id)
        {
            var plan = await _travelRepository.GetPlanByIdAsync(id);
            if (plan == null) return NotFound(new { Message = "Plan putovanja ne postoji." });

            int userId = GetCurrentUserId();
            if (plan.UserId != userId) return Forbid();

            await _travelRepository.DeletePlanAsync(id);
            return Ok(new { Message = "Plan putovanja i svi podaci su obrisani." });
        }

        [HttpPost("plans/{planId}/destinations")]
        public async Task<IActionResult> AddDestination(Guid planId, [FromBody] CreateDestinationDTO dto)
        {
            var plan = await _travelRepository.GetPlanByIdAsync(planId);
            if (plan == null) return NotFound(new { Message = "Plan putovanja nije pronadjen" });

            if(dto.ArrivalDate < plan.StartDate || dto.DepartureDate > plan.EndDate)
            {
                return BadRequest(new { Message = "Datumi destinacije moraju biti unutar opsega trajanja putovanja" });
            }

            var newDestination = new Destination
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Location = dto.Location,
                ArrivalDate = dto.ArrivalDate,
                DepartureDate = dto.DepartureDate,
                Notes = dto.Notes
            };

            await _travelRepository.AddDestinationAsync(planId,newDestination);
            return Ok(new { Message = "Destinacija uspesno dodata u plan" });
        }

        private static TravelPlanDTO MapToPlanDto(TravelPlan plan)
        {
            return new TravelPlanDTO
            {
                Id = plan.Id,
                UserId = plan.UserId,
                Title = plan.Title,
                Description = plan.Description,
                StartDate = plan.StartDate,
                EndDate = plan.EndDate,
                Budget = plan.Budget,
                GeneralNotes = plan.GeneralNotes,
                Destinations = plan.Destinations.Select(d => new DestinationDTO
                {
                    Id = d.Id,
                    Name = d.Name,
                    Location = d.Location,
                    ArrivalDate = d.ArrivalDate,
                    DepartureDate = d.DepartureDate,
                    Notes = d.Notes
                }).ToList(),
                Activities = plan.Activities.Select(a => new ActivityDTO
                {
                    Id = a.Id,
                    Title = a.Title,
                    Date = a.Date,
                    Time = a.Time,
                    Location = a.Location,
                    Description = a.Description,
                    EstimatedCost = a.EstimatedCost,
                    Status = a.Status
                }).ToList()
            };
        }

    }
}
