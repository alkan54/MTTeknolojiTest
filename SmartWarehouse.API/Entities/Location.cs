using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SmartWarehouse.API.Entities
{
    public class Location : BaseEntity
    {
        [Required]
        [MaxLength(50)]
        public string Code { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        // Navigation properties
        public ICollection<StockTransaction> StockTransactions { get; set; }
    }
}
