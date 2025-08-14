using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace DynamicApi.Models;

public class Post
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    [BsonElement("title")]
    public string Title { get; set; }

    [BsonElement("content")]
    public string Content { get; set; }

    [BsonElement("likes")]
    public string Likes { get; set; }

    [BsonElement("authorid")]
    public string AuthorId { get; set; }

    [BsonElement("author")]
    public string Author { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}