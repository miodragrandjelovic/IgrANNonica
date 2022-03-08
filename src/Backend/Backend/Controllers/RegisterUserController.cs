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

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterUserController : ControllerBase
    {
        private readonly UserDbContext _context;

        public RegisterUserController(UserDbContext context)
        {
            _context = context;
        }

        // GET: api/RegisterUser
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetRegisteredUsers()
        {
            return await _context.RegisteredUsers.ToListAsync();
        }

        // GET: api/RegisterUser/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUserDto(int id)
        {
            var userDto = await _context.RegisteredUsers.FindAsync(id);

            if (userDto == null)
            {
                return NotFound();
            }

            return userDto;
        }

        // PUT: api/RegisterUser/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserDto(int id, UserDto userDto)
        {
            if (id != userDto.UserId)
            {
                return BadRequest();
            }

            _context.Entry(userDto).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserDtoExists(id))
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

        // POST: api/RegisterUser
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<UserDto>> PostUserDto(UserDto userDto)
        {
            _context.RegisteredUsers.Add(userDto);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUserDto", new { id = userDto.UserId }, userDto);
        }

        // DELETE: api/RegisterUser/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserDto(int id)
        {
            var userDto = await _context.RegisteredUsers.FindAsync(id);
            if (userDto == null)
            {
                return NotFound();
            }

            _context.RegisteredUsers.Remove(userDto);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserDtoExists(int id)
        {
            return _context.RegisteredUsers.Any(e => e.UserId == id);
        }
    }
}
