using System.Threading.Tasks;
using SmartWarehouse.API.DTOs;

namespace SmartWarehouse.API.Managers
{
    public interface ITransactionManager
    {
        Task<bool> AddTransactionAsync(CreateTransactionDto dto);
    }
}
