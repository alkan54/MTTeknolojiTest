using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using SmartWarehouse.API.Entities;

namespace SmartWarehouse.API.Repositories
{
    public interface IRepository<T> where T : BaseEntity
    {
        Task<T> GetByIdAsync(int id, string companyId);
        IQueryable<T> Query(string companyId);
        Task AddAsync(T entity);
        void Update(T entity);
        void Delete(T entity); // Soft delete will be handled by Manager setting IsDeleted = true or Repository depending on design.
        // Let's implement soft delete explicitly in repo:
        void SoftDelete(T entity);
        Task SaveChangesAsync();
    }
}
