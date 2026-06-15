using Microsoft.EntityFrameworkCore;
using SmartWarehouse.API.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();

// Database connection
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// DI Registrations
builder.Services.AddScoped(typeof(SmartWarehouse.API.Repositories.IRepository<>), typeof(SmartWarehouse.API.Repositories.Repository<>));
builder.Services.AddScoped<SmartWarehouse.API.Managers.IProductManager, SmartWarehouse.API.Managers.ProductManager>();
builder.Services.AddScoped<SmartWarehouse.API.Managers.ITransactionManager, SmartWarehouse.API.Managers.TransactionManager>();

// CORS setup
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

// Apply Migrations and Seed Data
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    // Apply migrations if needed (or just ensure created for dev)
    // dbContext.Database.Migrate();

    var companyId = "MT-TEKNOLOJI-TEST-1";
    if (!dbContext.Locations.Any(l => l.CompanyId == companyId && l.Id == 1))
    {
        // Use an explicit SQL insert or simply Add if Id is identity
        // Since Id=1 is expected, let's just create one and hope it gets Id=1. 
        // If not, we can adjust the UI to fetch locations instead of hardcoding.
        // Actually, let's change the UI to fetch locations later, but for now just add a Location.
        if (!dbContext.Locations.Any(l => l.CompanyId == companyId))
        {
            dbContext.Locations.Add(new SmartWarehouse.API.Entities.Location
            {
                CompanyId = companyId,
                Name = "Main Warehouse - A1",
                Code = "MAIN-WH",
                CreatedAt = System.DateTime.UtcNow,
                UpdatedAt = System.DateTime.UtcNow
            });
            dbContext.SaveChanges();
        }
    }
}

app.Run();
