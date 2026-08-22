using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using AuthService.DTOs;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace AuthService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AuthDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;

        }

        // Test ruta: api/auth/test
        [HttpGet("test")]
        public IActionResult Test()
        {
            return Ok("AuthService Web API uspešno radi i dostupan je!");
        }

        // Ruta za registraciju: api/auth/register
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] UserRegisterDTO dto)
        {
            if (dto == null)
                return BadRequest("Podaci o korisniku nisu ispravno prosleđeni.");

            if (string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.Password) || string.IsNullOrEmpty(dto.Username))
                return BadRequest("Email i lozinka su obavezni.");

            // Provera da li korisnik već postoji
            var exists = await _context.Users.AnyAsync(u => u.Email == dto.Email || u.Username == dto.Username);
            if (exists)
                return BadRequest("Korisnik sa ovim email-om već postoji.");

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            var newUser = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = hashedPassword,
                Role = UserRole.Putnik
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok("Korisnik uspešno registrovan u novu TravelApp_Auth bazu!");
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] UserLoginDTO dto)
        {
            if (dto == null || string.IsNullOrEmpty(dto.Username) || string.IsNullOrEmpty(dto.Password))
                return BadRequest("Username i lozinka su obavezni.");

            // Pronalaženje korisnika u bazi
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == dto.Username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                return BadRequest("Pogrešan username ili lozinka.");
            }

            // Generisanje tokena
            var token = GenerateJwtToken(user);

            // Pakovanje odgovora u UserDTO
            var response = new UserDTO
            {
                Username = user.Username,
                Email = user.Email,
                Token = token,
                Role = user.Role.ToString(),
            };

            return Ok(response);
        }

        // Pomoćna metoda za kreiranje JWT tokena
        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]!);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), // Pretpostavka da User model ima Id

                    new Claim(ClaimTypes.Role, user.Role.ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(7), // Token važi 7 dana
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}