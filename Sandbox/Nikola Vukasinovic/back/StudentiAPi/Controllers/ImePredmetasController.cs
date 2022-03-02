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
    public class ImePredmetasController : ControllerBase
    {
        private readonly DataContext _context;

        public ImePredmetasController(DataContext context)
        {
            _context = context;
        }

        // GET: api/ImePredmetas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ImePredmeta>>> GetImenaPredmeta()
        {
            return await _context.ImenaPredmeta.ToListAsync();
        }

        // GET: api/ImePredmetas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ImePredmeta>> GetImePredmeta(int id)
        {
            var imePredmeta = await _context.ImenaPredmeta.FindAsync(id);

            if (imePredmeta == null)
            {
                return NotFound();
            }

            return imePredmeta;
        }

        // PUT: api/ImePredmetas/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutImePredmeta(int id, ImePredmeta imePredmeta)
        {
            if (id != imePredmeta.Id)
            {
                return BadRequest();
            }

            _context.Entry(imePredmeta).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ImePredmetaExists(id))
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

        // POST: api/ImePredmetas
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ImePredmeta>> PostImePredmeta(ImePredmeta imePredmeta)
        {
            _context.ImenaPredmeta.Add(imePredmeta);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetImePredmeta", new { id = imePredmeta.Id }, imePredmeta);
        }

        // DELETE: api/ImePredmetas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteImePredmeta(int id)
        {
            var imePredmeta = await _context.ImenaPredmeta.FindAsync(id);
            if (imePredmeta == null)
            {
                return NotFound();
            }

            _context.ImenaPredmeta.Remove(imePredmeta);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ImePredmetaExists(int id)
        {
            return _context.ImenaPredmeta.Any(e => e.Id == id);
        }
    }
}
