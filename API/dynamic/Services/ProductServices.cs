using Microsoft.Extensions.Options;
using MongoDB.Driver;
using DynamicApi.Models;

namespace DynamicApi.Services;

public class ProductService
{
    private readonly IMongoCollection<Product> _products;

    public ProductService(IOptions<MongoSettings> mongoSettings)
    {
        var client = new MongoClient(mongoSettings.Value.ConnectionString);
        var database = client.GetDatabase(mongoSettings.Value.DatabaseName);
        _products = database.GetCollection<Product>(mongoSettings.Value.CollectionName);
    }

    public List<Product> Get() => _products.Find(p => true).ToList();

    public Product Get(string id) => _products.Find(p => p.Id == id).FirstOrDefault();

    public void Create(Product product) => _products.InsertOne(product);

    public void Update(string id, Product product) =>
        _products.ReplaceOne(p => p.Id == id, product);

    public void Remove(string id) => _products.DeleteOne(p => p.Id == id);
}
