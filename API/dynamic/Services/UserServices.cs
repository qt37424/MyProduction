using MongoDB.Driver;
using DynamicApi.Models;
using DynamicApi.Models.Settings;
using Microsoft.Extensions.Options;

namespace DynamicApi.Services;

public class UserService
{
    private readonly IMongoCollection<User> _users;

    public UserService(IOptions<MongoSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        var database = client.GetDatabase(settings.Value.DatabaseName);
        _users = database.GetCollection<User>(settings.Value.UsersCollectionName);
    }

    public async Task<List<User>> GetAsync() => await _users.Find(_ => true).ToListAsync();

    public async Task<User?> GetAsync(string id) => await _users.Find(u => u.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(User user) => await _users.InsertOneAsync(user);

    public async Task UpdateAsync(string id, User userIn) => await _users.ReplaceOneAsync(u => u.Id == id, userIn);

    public async Task DeleteAsync(string id) => await _users.DeleteOneAsync(u => u.Id == id);
}
