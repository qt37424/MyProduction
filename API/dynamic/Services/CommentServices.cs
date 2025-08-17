using Microsoft.Extensions.Options;
using MongoDB.Driver;
using DynamicApi.Models;
using DynamicApi.Models.Settings;

namespace DynamicApi.Services;

public class CommentService
{
    private readonly IMongoCollection<Comment> _comments;

    public CommentService(IOptions<MongoSettings> mongoSettings)
    {
        var client = new MongoClient(mongoSettings.Value.ConnectionString);
        var database = client.GetDatabase(mongoSettings.Value.DatabaseName);
        _comments = database.GetCollection<Comment>(mongoSettings.Value.CommentsCollectionName);
    }

    public List<Comment> Get() => _comments.Find(p => true).ToList();

    public Comment Get(string id) => _comments.Find(p => p.Id == id).FirstOrDefault();

    public void Create(Comment comment) => _comments.InsertOne(comment);

    public void Update(string id, Comment comment) =>
        _comments.ReplaceOne(p => p.Id == id, comment);

    public void Remove(string id) => _comments.DeleteOne(p => p.Id == id);
}
