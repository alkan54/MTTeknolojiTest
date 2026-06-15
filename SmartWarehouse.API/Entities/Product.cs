using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartWarehouse.API.Entities
{
    public class Product : BaseEntity
    {
        [Required]
        [MaxLength(200)]
        public string Name { get; set; }

        [Required]
        [MaxLength(50)]
        public string SKU { get; set; }

        [MaxLength(100)]
        public string Barcode { get; set; }

        public int? CategoryId { get; set; }

        [ForeignKey(nameof(CategoryId))]
        public Category Category { get; set; }

        // Navigation properties
        public ICollection<StockTransaction> StockTransactions { get; set; }
    }
}
