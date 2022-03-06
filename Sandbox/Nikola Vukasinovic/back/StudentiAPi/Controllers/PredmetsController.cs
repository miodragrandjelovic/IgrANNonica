#nullable disable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentiAPi;
using StudentiAPi.Data;

namespace StudentiAPi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PredmetsController : ControllerBase
    {
        private readonly DataContext _context;

        public PredmetsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Predmets
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Predmet>>> GetPredmeti()
        {
            return await _context.Predmeti.ToListAsync();
        }

        // GET: api/Predmets/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Predmet>> GetPredmet(int id)
        {
            var predmet = await _context.Predmeti.FindAsync(id);

            if (predmet == null)
            {
                return NotFound();
            }

            return predmet;
        }

        // PUT: api/Predmets/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPredmet(int id, Predmet predmet)
        {
            if (id != predmet.Id)
            {
                return BadRequest();
            }

            _context.Entry(predmet).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PredmetExists(id))
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

        // POST: api/Predmets
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Predmet>> PostPredmet(Predmet predmet)
        {
            _context.Predmeti.Add(predmet);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPredmet", new { id = predmet.Id }, predmet);
        }

        // DELETE: api/Predmets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePredmet(int id)
        {
            var predmet = await _context.Predmeti.FindAsync(id);
            if (predmet == null)
            {
                return NotFound();
            }

            _context.Predmeti.Remove(predmet);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PredmetExists(int id)
        {
            return _context.Predmeti.Any(e => e.Id == id);
        }
    }
}
