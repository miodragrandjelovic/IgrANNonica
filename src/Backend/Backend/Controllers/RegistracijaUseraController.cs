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
using Newtonsoft.Json;
using Microsoft.AspNetCore.Identity;
using System.Text;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegistracijaUseraController : ControllerBase
    {

        public static User user = new User();
        private readonly UserManager<ApplicationUser> _userManager;//
        private readonly IConfiguration _configuration;
        private readonly UserDbContext _context;
        public static string Username;
        public static string? DirName { get; set; } //Ime foldera 
        public static string url = "http://127.0.0.1:3000";
        public RegistracijaUseraController(UserDbContext context, IConfiguration configuration)//
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpDelete("model")]//Ukloniti model iz foldera za odredjeni Username.
        public async Task<IActionResult> DeleteModel(string name)
        {
            //string pathToDelete = System.IO.Path.Combine(path1, names);

            if (Username == null)
            {
                return BadRequest("Niste ulogovani.");
            }
            else
            {
                string CurrentPath = Directory.GetCurrentDirectory();
                //string pathToDelete = CurrentPath + @"\Users\" + Username + "\\" + DirName + "\\" + name;
                string pathToDelete = Path.Combine(CurrentPath, "Users", Username, DirName, name);

                if (System.IO.Directory.Exists(pathToDelete))
                {
                    System.IO.Directory.Delete(pathToDelete, true);
                }
                return Ok("Uspesno uklonjen model." + pathToDelete);
            }
            
        }
        [HttpDelete("csv")]//Ukloniti samo csv bez modela ili ukloniti sve?!.
        public async Task<IActionResult> DeleteCsv(string name)
        {
            if (Username == null)
            {
                return BadRequest("Niste ulogovani.");
            }
            if(DirName == "name") //brise se ceo direktorijum od izabranog csv-a sa sve modelima i hiperparametrima
            {
                string CurrentPath = Directory.GetCurrentDirectory();
                //string pathToDelete = CurrentPath + @"\Users\" + Username + "\\" + DirName;
                string pathToDelete = Path.Combine(CurrentPath, "Users", Username, DirName);

                if (System.IO.Directory.Exists(pathToDelete))
                {
                    System.IO.Directory.Delete(pathToDelete, true);
                }
                return Ok("Uspesno uklonjen csv folder sa svim modelima i hiperparametrima." + pathToDelete);
            }
            else //brisanje samo csv fajla modeli i hiperparametri ostaju
            {
                string CurrentPath = Directory.GetCurrentDirectory();
                //string pathToDelete = CurrentPath + @"\Users\" + Username + "\\" + DirName + "\\" + DirName + ".csv";
                string fileName = name + ".csv";
                string pathToDelete = Path.Combine(CurrentPath, "Users", Username, name, fileName);

                if (System.IO.File.Exists(pathToDelete))
                {
                    System.IO.File.Delete(pathToDelete);
                }
                return Ok("Uspesno uklonjen samo csv fajl." + pathToDelete);
            }
        }

        [HttpGet] //Vracanje svih korisnika iz baze.
        public async Task<ActionResult<IEnumerable<User>>> GetRegistrovaniUseri()
        {
            return await _context.RegistrovaniUseri.ToListAsync();
        }

        [HttpGet("username")] //Dobijanje podataka o korisniku sa datim Username-om.
        public async Task<ActionResult<User>> GetUsername(string username)
        {
            //return User_postoji(username);
            var user = await _context.RegistrovaniUseri.SingleOrDefaultAsync(x => x.Username == username);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }
        [HttpDelete("username")]//Ukloniti nalog iz baze za odredjeni Username kao i ukloniti njegov folder sa sacuvanim eksperimentima.
        public async Task<IActionResult> DeleteUsername(string username)
        {
            var user = await _context.RegistrovaniUseri.SingleOrDefaultAsync(x => x.Username == username);
            if (user == null)
            {
                return NotFound();
            }

            _context.RegistrovaniUseri.Remove(user);
            await _context.SaveChangesAsync();

            string CurrentPath = Directory.GetCurrentDirectory();
            //string pathToDelete = CurrentPath + @"\Users\" + username;
            string pathToDelete = Path.Combine(CurrentPath, "Users", username);

            if (System.IO.Directory.Exists(pathToDelete))
            {
                System.IO.Directory.Delete(pathToDelete, true);
            }

            return Ok("Uspesno uklonjen nalog.");
        }

        [HttpGet("{id}")]//Dobijanje podataka o korisniku sa datim ID-jem.
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.RegistrovaniUseri.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpPut("username")]//Menjanje podataka o korisniku sa datim Username-om. Menja se sve osim Username-a?!
        public async Task<IActionResult> PutUsername(User user)
        {
            /*if (username != user.Username)
            {
                return BadRequest();
            }*/

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserPostoji(user.Username))
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
        [HttpPut("{id}")]//Menjanje podataka o korisniku sa datim ID-jem.
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


        [HttpPost] //Registrovanje korisnika.-------------------------------------------------------------------------------------------------------------
        public async Task<ActionResult<User>> PostUser(UserDto request)
        {
            CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);
            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.Email = request.Email;
            user.Username = request.Username;
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            _context.RegistrovaniUseri.Add(
                new User
                {
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    Username = user.Username,
                    PasswordHash = passwordHash,
                    PasswordSalt = passwordSalt
                });
            await _context.SaveChangesAsync();
            var entries = _context.ChangeTracker.Entries().Where(e => e.State == EntityState.Added).Select(e => new { e.State, e }).ToList();

            //Pravljenje foldera za svakog korisnika posebno
            string currentPath = Directory.GetCurrentDirectory();
            //string newPath = currentPath + @"\Users\" + user.Username;
            string newPath = Path.Combine(currentPath, "Users", user.Username);
            if (Directory.Exists(newPath))
                Console.WriteLine("User already exists on disk!");
            else
            {
                System.IO.Directory.CreateDirectory(newPath);
                Console.WriteLine("Directory for '{0}' created successfully!", user.Username);
            }


            return CreatedAtAction("GetUsername", new { username = user.Username }, user);
        }
        private bool UserPostoji(string username) //trazenje usera po Username-u. Bice bitno zbog menjanja ostalih podataka o njemu.
        {
            return _context.RegistrovaniUseri.Any(e => e.Username == username);
        }
        private bool UserExists(int id) //trazenje usera po Id-ju.
        {
            return _context.RegistrovaniUseri.Any(e => e.UserId == id);
        }
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt) //Enkodiranje sifre.
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt) //Verifikacija sifre.
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);
            }
        }

        [HttpDelete("{id}")]//Ukloniti nalog iz baze za odredjeni ID.
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


        [HttpPost("login")]//Logovanje korisnika.
        public async Task<ActionResult<string>> Login(UserDto request)
        {
            var user = await _context.RegistrovaniUseri.SingleOrDefaultAsync(x => x.Username == request.Username);

            if (user == null)
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
            Username = request.Username;
            LoadData.Username = Username;
            PythonController.Username = Username;

            string token1 = CreateToken(user);
            var refreshToken = GenerateRefreshToken();
            _ = int.TryParse(_configuration["JWT:RefreshTokenValidityInDays"], out int refreshTokenValidityInDays);

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.Now.AddDays(refreshTokenValidityInDays);

            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            var jtoken = new
            {
                Token = token1
            };
            return Ok(jtoken);
        }

        [HttpGet("logout")]//Logout korisnika.
        public async Task<ActionResult<string>> Logout()
        {
            string previousUser = Username;
            Username = null;
            LoadData.Username = Username;
            PythonController.Username = Username;
            if(previousUser != null)
            {
                return Ok("Korisnik " + previousUser + " se uspesno izlogovao.");
            }
            else
                return Ok("Niko nije bio ulogovan.");

        }

        private string CreateToken(User user)//Pravljenje tokena pri logovanju.
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.Username)/*,
                new Claim(ClaimTypes.GivenName, user.FirstName),
                new Claim(ClaimTypes.Surname, user.LastName),
                new Claim(ClaimTypes.Email, user.Email)*/
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

        [HttpPost]
        [Route("refresh-token")]
        public async Task<IActionResult> RefreshToken(TokenModel tokenModel)
        {
            if (tokenModel is null)
            {
                return BadRequest("Invalid client request");
            }

            string? accessToken = tokenModel.AccessToken;
            string? refreshToken = tokenModel.RefreshToken;

            var principal = GetPrincipalFromExpiredToken(accessToken);
            if (principal == null)
            {
                return BadRequest("Invalid access token or refresh token");
            }

            #pragma warning disable CS8600 // Converting null literal or possible null value to non-nullable type.
            #pragma warning disable CS8602 // Dereference of a possibly null reference.
            string username = principal.Identity.Name;
            #pragma warning restore CS8602 // Dereference of a possibly null reference.
            #pragma warning restore CS8600 // Converting null literal or possible null value to non-nullable type.

            var user = await _context.RegistrovaniUseri.SingleOrDefaultAsync(x => x.Username == username);

            if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
            {
                return BadRequest("Invalid access token or refresh token");
            }

            var newAccessToken = CreateToken(principal.Claims.ToList());
            var newRefreshToken = GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return new ObjectResult(new
            {
                accessToken = new JwtSecurityTokenHandler().WriteToken(newAccessToken),
                refreshToken = newRefreshToken
            });
        }

        //[Authorize]
        [HttpPost]
        [Route("revoke/{username}")]
        public async Task<IActionResult> Revoke(string username)
        {
            var user = await _context.RegistrovaniUseri.SingleOrDefaultAsync(x => x.Username == username);
            if (user == null) return BadRequest("Invalid user name");

            user.RefreshToken = null;
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        //[Authorize]
        [HttpPost]
        [Route("revoke-all")]
        public async Task<IActionResult> RevokeAll()
        {
            var users = _context.RegistrovaniUseri.ToList();
            foreach (var user in users)
            {
                user.RefreshToken = null;
                _context.Entry(user).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }

            return NoContent();
        }

        private JwtSecurityToken CreateToken(List<Claim> authClaims)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));
            _ = int.TryParse(_configuration["JWT:TokenValidityInMinutes"], out int tokenValidityInMinutes);

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddMinutes(tokenValidityInMinutes),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );

            return token;
        }

        private static string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        private ClaimsPrincipal? GetPrincipalFromExpiredToken(string? token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"])),
                ValidateLifetime = false
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);
            if (securityToken is not JwtSecurityToken jwtSecurityToken || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");

            return principal;

        }
        /*public void ReadJWTs(string token) //ako se pri svakom pozivanju funkcije prosledi i jwt koji je korisnik to trazio onda bi nam trebalo ovako nesto
        {
            var stream = token;
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(stream);
            var tokenS = jsonToken as JwtSecurityToken;

            var username = tokenS.Claims.First(claim => claim.Type == "name").Value;
        }*/
        [HttpPost("jwt")] //dobijanje trenutnog ulogovanog usera a ne jedinog(poslednjeg) ulogovanog kao do sad
        public async Task<ActionResult<string>> ReadJWT(String token)
        {
            var stream = token;
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(stream);
            var tokenS = jsonToken as JwtSecurityToken;

            var username = tokenS.Claims.First(claim => claim.Type == "name").Value;

            return Ok(username);
        }


    }
}
