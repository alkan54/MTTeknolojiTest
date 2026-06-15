using System.ComponentModel.DataAnnotations;

namespace SmartWarehouse.API.DTOs
{
    public class CreateTransactionDto
    {
        [Required]
        public string CompanyId { get; set; }

        [Required]
        public int ProductId { get; set; }

        [Required]
        public int LocationId { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }

        [Required]
        public int TransactionType { get; set; } // 1 for Entry, 2 for Exit

        public string Notes { get; set; }
    }
}
