using System.Threading.Tasks;
using SmartWarehouse.API.DTOs;
using SmartWarehouse.API.Entities;
using SmartWarehouse.API.Repositories;

namespace SmartWarehouse.API.Managers
{
    public class TransactionManager : ITransactionManager
    {
        private readonly IRepository<StockTransaction> _transactionRepository;
        private readonly IRepository<Product> _productRepository;
        private readonly IRepository<Location> _locationRepository;

        public TransactionManager(
            IRepository<StockTransaction> transactionRepository,
            IRepository<Product> productRepository,
            IRepository<Location> locationRepository)
        {
            _transactionRepository = transactionRepository;
            _productRepository = productRepository;
            _locationRepository = locationRepository;
        }

        public async Task<bool> AddTransactionAsync(CreateTransactionDto dto)
        {
            // Validate Product and Location belong to Company
            var product = await _productRepository.GetByIdAsync(dto.ProductId, dto.CompanyId);
            if (product == null) return false;

            var location = await _locationRepository.GetByIdAsync(dto.LocationId, dto.CompanyId);
            if (location == null) return false;

            var transaction = new StockTransaction
            {
                CompanyId = dto.CompanyId,
                ProductId = dto.ProductId,
                LocationId = dto.LocationId,
                Quantity = dto.TransactionType == (int)TransactionType.Entry ? dto.Quantity : -dto.Quantity,
                TransactionType = (TransactionType)dto.TransactionType,
                Notes = dto.Notes
            };

            await _transactionRepository.AddAsync(transaction);
            await _transactionRepository.SaveChangesAsync();

            return true;
        }
    }
}
