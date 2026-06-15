using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartWarehouse.API.Entities
{
    public enum TransactionType
    {
        Entry = 1,
        Exit = 2
    }

    public class StockTransaction : BaseEntity
    {
        [Required]
        public int ProductId { get; set; }

        [ForeignKey(nameof(ProductId))]
        public Product Product { get; set; }

        [Required]
        public int LocationId { get; set; }

        [ForeignKey(nameof(LocationId))]
        public Location Location { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        public TransactionType TransactionType { get; set; }

        [MaxLength(500)]
        public string Notes { get; set; }
    }
}
