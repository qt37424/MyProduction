using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace DynamicApi.Models;

public class Comment
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    [BsonElement("content")]
    public string Content { get; set; }

    [BsonElement("postid")]
    public string PostId { get; set; }

    [BsonElement("post")]
    public string Post { get; set; }

    [BsonElement("authorid")]
    public string AuthorId { get; set; }

    [BsonElement("author")]
    public string Author { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}