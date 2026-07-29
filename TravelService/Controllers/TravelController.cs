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

        [HttpGet("plans/{planId}/destinations")]
        public async Task<IActionResult> GetDestinations(Guid planId)
        {
            var destinations = await _travelRepository.GetDestinationsByPlanIdAsync(planId);
            return Ok(destinations);
        }

        [HttpPost("plans/{planId}/destinations")]
        public async Task<IActionResult> AddDestination(Guid planId, [FromBody] CreateDestinationDTO dto)
        {
            var newDestination = new Destination
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Location = dto.Location,
                ArrivalDate = dto.ArrivalDate,
                DepartureDate = dto.DepartureDate,
                Notes = dto.Notes
            };

            var uspesno = await _travelRepository.AddDestinationAsync(planId, newDestination);
            if (!uspesno) return NotFound(new { Message = "Plan putovanja nije pronađen" });

            return Ok(newDestination);
        }

        [HttpPut("plans/{planId}/destinations/{destinationId}")]
        public async Task<IActionResult> UpdateDestination(Guid planId, Guid destinationId, [FromBody] CreateDestinationDTO dto)
        {
            var destination = new Destination
            {
                Id = destinationId,
                Name = dto.Name,
                Location = dto.Location,
                ArrivalDate = dto.ArrivalDate,
                DepartureDate = dto.DepartureDate,
                Notes = dto.Notes
            };

            var uspesno = await _travelRepository.UpdateDestinationAsync(planId, destination);
            if (!uspesno) return NotFound(new { Message = "Plan ili destinacija nisu pronađeni" });

            return Ok(destination);
        }

        [HttpDelete("plans/{planId}/destinations/{destinationId}")]
        public async Task<IActionResult> DeleteDestination(Guid planId, Guid destinationId)
        {
            var uspesno = await _travelRepository.DeleteDestinationAsync(planId, destinationId);
            if (!uspesno) return NotFound(new { Message = "Plan ili destinacija nisu pronađeni" });

            return Ok(new { Message = "Destinacija je uspešno obrisana" });
        }

        [HttpGet("plans/{planId}/activities")]
        public async Task<IActionResult> GetActivities(Guid planId)
        {
            var activities = await _travelRepository.GetActivitiesByPlanIdAsync(planId);
            var dtos = activities.Select(MapActivityToDto);
            return Ok(dtos);
        }

        [HttpPost("plans/{planId}/activities")]
        public async Task<IActionResult> AddActivity(Guid planId, [FromBody] CreateActivityDTO dto)
        {
            Enum.TryParse<ActivityStatus>(dto.Status, true, out var parsedStatus);
            var newActivity = new Activity
            {
                Id = Guid.NewGuid(),
                Title = dto.Title,
                Date = dto.Date,
                Time = dto.Time,
                Location = dto.Location,
                Description = dto.Description,
                EstimatedCost = dto.EstimatedCost,
                Status = parsedStatus
            };

            var uspesno = await _travelRepository.AddActivityAsync(planId, newActivity);
            if (!uspesno) return NotFound(new { Message = "Plan putovanja nije pronađen" });

            return Ok(MapActivityToDto(newActivity));
        }

        [HttpPut("plans/{planId}/activities/{activityId}")]
        public async Task<IActionResult> UpdateActivity(Guid planId, Guid activityId, [FromBody] CreateActivityDTO dto)
        {
            Enum.TryParse<ActivityStatus>(dto.Status, true, out var parsedStatus);
            var activity = new Activity
            {
                Id = activityId,
                Title = dto.Title,
                Date = dto.Date,
                Time = dto.Time,
                Location = dto.Location,
                Description = dto.Description,
                EstimatedCost = dto.EstimatedCost,
                Status = parsedStatus
            };

            var uspesno = await _travelRepository.UpdateActivityAsync(planId, activity);
            if (!uspesno) return NotFound(new { Message = "Plan ili aktivnost nisu pronađeni" });

            return Ok(MapActivityToDto(activity));
        }

        [HttpDelete("plans/{planId}/activities/{activityId}")]
        public async Task<IActionResult> DeleteActivity(Guid planId, Guid activityId)
        {
            var uspesno = await _travelRepository.DeleteActivityAsync(planId, activityId);
            if (!uspesno) return NotFound(new { Message = "Plan ili aktivnost nisu pronađeni" });

            return Ok(new { Message = "Aktivnost uspešno obrisana" });
        }

        private static ActivityDTO MapActivityToDto(Activity activity)
        {
            return new ActivityDTO
            {
                Id = activity.Id,
                Title = activity.Title,
                Date = activity.Date,
                Time = activity.Time,
                Location = activity.Location,
                Description = activity.Description,
                EstimatedCost = activity.EstimatedCost,
                Status = activity.Status.ToString()
            };
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
                    Status = a.Status.ToString(),
                }).ToList()
            };
        }

    }
}
