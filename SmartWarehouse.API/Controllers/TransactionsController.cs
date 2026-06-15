using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using SmartWarehouse.API.DTOs;
using SmartWarehouse.API.Managers;
using System.Linq;

namespace SmartWarehouse.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly ITransactionManager _transactionManager;

        public TransactionsController(ITransactionManager transactionManager)
        {
            _transactionManager = transactionManager;
        }

        private string GetCompanyId()
        {
            if (Request.Headers.TryGetValue("X-Company-Id", out var companyId))
            {
                return companyId.FirstOrDefault();
            }
            return null;
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateTransactionDto dto)
        {
            var companyId = GetCompanyId();
            if (string.IsNullOrEmpty(companyId)) return BadRequest("CompanyId is required in headers.");

            if (dto.CompanyId != companyId) return StatusCode(403, "CompanyId mismatch.");

            var success = await _transactionManager.AddTransactionAsync(dto);
            if (!success) return BadRequest("Invalid product or location.");

            return Ok(new { success = true });
        }
    }
}
