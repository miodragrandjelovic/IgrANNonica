using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using projekat.Models;

namespace projekat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterDetailController : ControllerBase
    {
        private readonly RegisterDetailsContext _context;

        public RegisterDetailController(RegisterDetailsContext context)
        {
            _context = context;
        }

        // GET: api/RegisterDetail
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RegisterDetails>>> GetRegisterDetails() //vracamo ono sto imamo u bazi
        {
            return await _context.RegisterDetails.ToListAsync();
        }

        // GET: api/RegisterDetail/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RegisterDetails>> GetRegisterDetails(int id)
        {
            var registerDetails = await _context.RegisterDetails.FindAsync(id);

            if (registerDetails == null)
            {
                return NotFound();
            }

            return registerDetails;
        }

        // PUT: api/RegisterDetail/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRegisterDetails(int id, RegisterDetails registerDetails)
        {
            if (id != registerDetails.RegisterId)
            {
                return BadRequest();
            }

            _context.Entry(registerDetails).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RegisterDetailsExists(id))
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

        // POST: api/RegisterDetail
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<RegisterDetails>> PostRegisterDetails(RegisterDetails registerDetails)  //da se ubaci novi podatak
        {
            _context.RegisterDetails.Add(registerDetails);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRegisterDetails", new { id = registerDetails.RegisterId }, registerDetails);
        }

        // DELETE: api/RegisterDetail/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRegisterDetails(int id)
        {
            var registerDetails = await _context.RegisterDetails.FindAsync(id);
            if (registerDetails == null)
            {
                return NotFound();
            }

            _context.RegisterDetails.Remove(registerDetails);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RegisterDetailsExists(int id)
        {
            return _context.RegisterDetails.Any(e => e.RegisterId == id);
        }
    }
}
