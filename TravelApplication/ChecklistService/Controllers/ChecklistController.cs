using ChecklistService.DTOs;
using ChecklistService.Models;
using ChecklistService.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ChecklistService.Controllers
{
    [ApiController]
    [Route("api/checklist")]
    public class ChecklistController : ControllerBase
    {
        private readonly IChecklistRepository _checklistRepository;

        public ChecklistController(IChecklistRepository checklistRepository)
        {
            _checklistRepository = checklistRepository;
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

        private bool IsAdmin()
        {
            return User.IsInRole("Admin") || User.FindFirst(ClaimTypes.Role)?.Value == "Admin";
        }

        [HttpPost("items")]
        public async Task<IActionResult> AddItem([FromBody] CreateChecklistItemDTO dto)
        {
            int userId = GetCurrentUserId();
            if(userId == 0) return Unauthorized(new {Message = "Nevazeci korisnicki token"});

            var newItem = new ChecklistItem
            {
                Id = Guid.NewGuid(),
                TravelPlanId = dto.TravelPlanId,
                UserId = userId,
                Title = dto.Title,
                Category = string.IsNullOrWhiteSpace(dto.Category) ? "Opste" : dto.Category,
                IsPacked = false
            };

            await _checklistRepository.AddItemAsync(newItem);

            var resultDto = MapToDto(newItem);
            return CreatedAtAction(nameof(GetItemById), new {id  =resultDto.Id}, resultDto);
        }

        [HttpGet("items/{id}")]
        public async Task<IActionResult> GetItemById(Guid id)
        {
            var item = await _checklistRepository.GetItemByIdAsync(id);
            if(item == null) return NotFound(new {Message = "Stavka nije pronadjena"});

            return Ok(MapToDto(item));
        }

        [HttpPatch("items/{id}/status")]
        public async Task<IActionResult> UpdateItemStatus(Guid id, [FromBody] UpdateChecklistItemStatusDTO dto)
        {
            int userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized();

            var item = await _checklistRepository.GetItemByIdAsync(id);
            if (item == null) return NotFound(new { Message = "Stavka nije pronadjena" });

            if (!IsAdmin() && item.UserId != userId)
            {
                return Forbid();
            }
            var uspesno = await _checklistRepository.UpdateItemStatusAsync(id, dto.IsPacked);
            if (!uspesno) return NotFound(new { Message = "Greska pri azuriranju stavke" });

            return Ok(new { Message = "Status stavke uspesno azuriran" });
        }

        [HttpGet("plans/{travelPlanId}/items")]
        public async Task<IActionResult> GetItemsByPlanId(Guid travelPlanId)
        {
            var items = await _checklistRepository.GetItemsByPlanIdAsync(travelPlanId);
            var dtos = items.Select(MapToDto);
            return Ok(dtos);
        }

        [HttpDelete("items/{id}")]
        public async Task<IActionResult> DeleteItem(Guid id)
        {
            int userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized();

            var item = await _checklistRepository.GetItemByIdAsync(id);
            if (item == null) return NotFound(new { Message = "Stavka nije pronadjena" });

            if (!IsAdmin() && item.UserId != userId)
            {
                return Forbid();
            }
            var uspesno = await _checklistRepository.DeleteItemAsync(id);
            if (!uspesno) return NotFound(new { Message = "Greska pri brisanju stavke" });

            return Ok(new { Message = "Stavka uspesno obrisana" });
        }

        private static ChecklistItemDTO MapToDto(ChecklistItem item)
        {
            return new ChecklistItemDTO
            {
                Id = item.Id,
                TravelPlanId = item.TravelPlanId,
                Title = item.Title,
                Category = item.Category,
                IsPacked = item.IsPacked
            };
        }
    }
}
