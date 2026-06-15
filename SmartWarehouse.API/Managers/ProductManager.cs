using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SmartWarehouse.API.DTOs;
using SmartWarehouse.API.Entities;
using SmartWarehouse.API.Repositories;

namespace SmartWarehouse.API.Managers
{
    public class ProductManager : IProductManager
    {
        private readonly IRepository<Product> _productRepository;
        private readonly IRepository<StockTransaction> _transactionRepository;

        public ProductManager(IRepository<Product> productRepository, IRepository<StockTransaction> transactionRepository)
        {
            _productRepository = productRepository;
            _transactionRepository = transactionRepository;
        }

        public async Task<PagedResultDto<ProductDto>> GetProductsAsync(string companyId, int page, int pageSize, string search)
        {
            var query = _productRepository.Query(companyId);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p => p.Name.Contains(search) || p.SKU.Contains(search));
            }

            var totalCount = await query.CountAsync();

            var products = await query
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Calculate stock quantities (For a real system this might be a view or grouped query)
            var productIds = products.Select(p => p.Id).ToList();
            var stockData = await _transactionRepository.Query(companyId)
                .Where(t => productIds.Contains(t.ProductId))
                .GroupBy(t => t.ProductId)
                .Select(g => new { ProductId = g.Key, TotalStock = g.Sum(x => x.Quantity) })
                .ToDictionaryAsync(x => x.ProductId, x => x.TotalStock);

            var data = products.Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                SKU = p.SKU,
                Barcode = p.Barcode,
                CategoryId = p.CategoryId,
                StockQuantity = stockData.ContainsKey(p.Id) ? stockData[p.Id] : 0
            }).ToList();

            return new PagedResultDto<ProductDto>
            {
                Success = true,
                Data = data,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            };
        }

        public async Task<ProductDto> GetByIdAsync(int id, string companyId)
        {
            var product = await _productRepository.GetByIdAsync(id, companyId);
            if (product == null) return null;

            var stock = await _transactionRepository.Query(companyId)
                .Where(t => t.ProductId == id)
                .SumAsync(t => t.Quantity);

            return new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                SKU = product.SKU,
                Barcode = product.Barcode,
                CategoryId = product.CategoryId,
                StockQuantity = stock
            };
        }

        public async Task<ProductDto> CreateAsync(CreateProductDto dto)
        {
            var product = new Product
            {
                CompanyId = dto.CompanyId,
                Name = dto.Name,
                SKU = dto.SKU,
                Barcode = dto.Barcode,
                CategoryId = dto.CategoryId
            };

            await _productRepository.AddAsync(product);
            await _productRepository.SaveChangesAsync();

            return await GetByIdAsync(product.Id, dto.CompanyId);
        }

        public async Task<ProductDto> UpdateAsync(UpdateProductDto dto)
        {
            var product = await _productRepository.GetByIdAsync(dto.Id, dto.CompanyId);
            if (product == null) return null;

            product.Name = dto.Name;
            product.SKU = dto.SKU;
            product.Barcode = dto.Barcode;
            product.CategoryId = dto.CategoryId;

            _productRepository.Update(product);
            await _productRepository.SaveChangesAsync();

            return await GetByIdAsync(product.Id, dto.CompanyId);
        }

        public async Task<bool> DeleteAsync(DeleteDto dto)
        {
            var product = await _productRepository.GetByIdAsync(dto.Id, dto.CompanyId);
            if (product == null) return false;

            _productRepository.SoftDelete(product);
            await _productRepository.SaveChangesAsync();

            return true;
        }
    }
}
