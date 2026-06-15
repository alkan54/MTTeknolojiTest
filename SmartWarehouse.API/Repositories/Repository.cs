using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SmartWarehouse.API.Data;
using SmartWarehouse.API.Entities;

namespace SmartWarehouse.API.Repositories
{
    public class Repository<T> : IRepository<T> where T : BaseEntity
    {
        protected readonly AppDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public Repository(AppDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        public async Task<T> GetByIdAsync(int id, string companyId)
        {
            return await _dbSet.FirstOrDefaultAsync(x => x.Id == id && x.CompanyId == companyId);
        }

        public IQueryable<T> Query(string companyId)
        {
            return _dbSet.Where(x => x.CompanyId == companyId);
        }

        public async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
        }

        public void Update(T entity)
        {
            // Requirement 4: EntityState.Modified Zorunlu
            _context.Entry(entity).State = EntityState.Modified;
        }

        public void Delete(T entity)
        {
            _dbSet.Remove(entity);
        }

        public void SoftDelete(T entity)
        {
            entity.IsDeleted = true;
            Update(entity);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
