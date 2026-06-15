using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using SmartWarehouse.API.DTOs;
using SmartWarehouse.API.Managers;
using System.Linq;

namespace SmartWarehouse.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductManager _productManager;

        public ProductsController(IProductManager productManager)
        {
            _productManager = productManager;
        }

        private string GetCompanyId()
        {
            // Simplified CompanyId retrieval
            if (Request.Headers.TryGetValue("X-Company-Id", out var companyId))
            {
                return companyId.FirstOrDefault();
            }
            return null; // Should handle this appropriately (e.g. 400 or 403)
        }

        [HttpGet]
        public async Task<IActionResult> GetList([FromQuery] int page = 1, [FromQuery] int pageSize = 25, [FromQuery] string search = "")
        {
            var companyId = GetCompanyId();
            if (string.IsNullOrEmpty(companyId)) return BadRequest("CompanyId is required in headers (X-Company-Id).");

            var result = await _productManager.GetProductsAsync(companyId, page, pageSize, search);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var companyId = GetCompanyId();
            if (string.IsNullOrEmpty(companyId)) return BadRequest("CompanyId is required in headers.");

            var product = await _productManager.GetByIdAsync(id, companyId);
            if (product == null) return NotFound();

            return Ok(product);
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
        {
            var companyId = GetCompanyId();
            if (string.IsNullOrEmpty(companyId)) return BadRequest("CompanyId is required in headers.");

            // Enforce header companyId overrides body or body must match
            if (dto.CompanyId != companyId) return StatusCode(403, "CompanyId mismatch.");

            var result = await _productManager.CreateAsync(dto);
            return Ok(result);
        }

        [HttpPost("update")]
        public async Task<IActionResult> Update([FromBody] UpdateProductDto dto)
        {
            var companyId = GetCompanyId();
            if (string.IsNullOrEmpty(companyId)) return BadRequest("CompanyId is required in headers.");

            if (dto.CompanyId != companyId) return StatusCode(403, "CompanyId mismatch.");

            var result = await _productManager.UpdateAsync(dto);
            if (result == null) return NotFound();

            return Ok(result);
        }

        [HttpPost("delete")]
        public async Task<IActionResult> Delete([FromBody] DeleteDto dto)
        {
            var companyId = GetCompanyId();
            if (string.IsNullOrEmpty(companyId)) return BadRequest("CompanyId is required in headers.");

            if (dto.CompanyId != companyId) return StatusCode(403, "CompanyId mismatch.");

            var success = await _productManager.DeleteAsync(dto);
            if (!success) return NotFound();

            return Ok(new { success = true });
        }
    }
}
