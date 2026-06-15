using System.Threading.Tasks;
using SmartWarehouse.API.DTOs;

namespace SmartWarehouse.API.Managers
{
    public interface IProductManager
    {
        Task<PagedResultDto<ProductDto>> GetProductsAsync(string companyId, int page, int pageSize, string search);
        Task<ProductDto> GetByIdAsync(int id, string companyId);
        Task<ProductDto> CreateAsync(CreateProductDto dto);
        Task<ProductDto> UpdateAsync(UpdateProductDto dto);
        Task<bool> DeleteAsync(DeleteDto dto);
    }
}
