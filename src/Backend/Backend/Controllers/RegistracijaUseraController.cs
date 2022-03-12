#nullable disable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend;
using Backend.Models;
using System.Security.Cryptography;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegistracijaUseraController : ControllerBase
    {

        public static User user = new User();
        private readonly IConfiguration _configuration;
        /*
        public RegistracijaUseraController(IConfiguration configuration)
        {
            _configuration = configuration;
        }*/

        private readonly UserDbContext _context;

        public RegistracijaUseraController(UserDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // GET: api/RegistracijaUsera
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetRegistrovaniUseri()
        {
            return await _context.RegistrovaniUseri.ToListAsync();
        }

        // GET: api/RegistracijaUsera/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.RegistrovaniUseri.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/RegistracijaUsera/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.UserId)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }
      
      //  public static User user = new User();
        // POST: api/RegistracijaUsera
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(UserDto request)
        {
            CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);
            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.Email = request.Email;
            user.Username = request.Username;
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
           
            //_context.RegistrovaniUseri.Add(user);
            
            //otklanja gresku i kreira novog usera ali mu ne menja id pa ga ni ne ubacuje u bazu jer user sa tim id-jem vec postoji
            _context.ChangeTracker.TrackGraph(user, node =>
                node.Entry.State = !node.Entry.IsKeySet ? EntityState.Added : EntityState.Unchanged);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.UserId }, user);
        }
        private bool User_postoji(string username)
        {
            return _context.RegistrovaniUseri.Any(e => e.Username == username);
        }
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);
            }
        }

        // DELETE: api/RegistracijaUsera/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.RegistrovaniUseri.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.RegistrovaniUseri.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.RegistrovaniUseri.Any(e => e.UserId == id);
        }


        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(UserDto request)
        {
            var user = await _context.RegistrovaniUseri.SingleOrDefaultAsync(x => x.Username == request.Username);

            if(user == null)
            {
                return BadRequest("Korisnik nije pronadjen!");
            }
            if (user.Username != request.Username)
            {
                return BadRequest("Pogresan username!");
            }
            if (!VerifyPasswordHash(request.Password, user.PasswordHash, user.PasswordSalt))
            {
                return BadRequest("Pogresna sifra!");
            }

            string token = CreateToken(user);
            return Ok(token);
        }
        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username)
            };
            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds);

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

    }
}
