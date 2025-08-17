using Microsoft.Extensions.Options;
using MongoDB.Driver;
using DynamicApi.Models;
using DynamicApi.Models.Settings;

namespace DynamicApi.Services;

public class PostService
{
    private readonly IMongoCollection<Post> _posts;

    public PostService(IOptions<MongoSettings> mongoSettings)
    {
        var client = new MongoClient(mongoSettings.Value.ConnectionString);
        var database = client.GetDatabase(mongoSettings.Value.DatabaseName);
        _posts = database.GetCollection<Post>(mongoSettings.Value.PostsCollectionName);
    }

    public List<Post> Get() => _posts.Find(p => true).ToList();

    public Post Get(string id) => _posts.Find(p => p.Id == id).FirstOrDefault();

    public void Create(Post post) => _posts.InsertOne(post);

    public void Update(string id, Post post) =>
        _posts.ReplaceOne(p => p.Id == id, post);

    public void Remove(string id) => _posts.DeleteOne(p => p.Id == id);
}
