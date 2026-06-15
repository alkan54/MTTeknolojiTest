using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SmartWarehouse.API.Entities
{
    public class Category : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [MaxLength(500)]
        public string Description { get; set; }

        // Navigation properties
        public ICollection<Product> Products { get; set; }
    }
}
