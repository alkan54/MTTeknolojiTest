using System.ComponentModel.DataAnnotations;

namespace SmartWarehouse.API.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string SKU { get; set; }
        public string Barcode { get; set; }
        public int? CategoryId { get; set; }
        public int StockQuantity { get; set; } // Calculated field
    }

    public class CreateProductDto
    {
        [Required]
        public string CompanyId { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string SKU { get; set; }
        public string Barcode { get; set; }
        public int? CategoryId { get; set; }
    }

    public class UpdateProductDto
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string CompanyId { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string SKU { get; set; }
        public string Barcode { get; set; }
        public int? CategoryId { get; set; }
    }
}
