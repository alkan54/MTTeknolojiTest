using System.Collections.Generic;

namespace SmartWarehouse.API.DTOs
{
    public class PagedResultDto<T>
    {
        public bool Success { get; set; } = true;
        public List<T> Data { get; set; } = new List<T>();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }

    public class DeleteDto
    {
        public int Id { get; set; }
        public string CompanyId { get; set; }
    }
}
