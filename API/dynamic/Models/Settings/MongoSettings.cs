namespace DynamicApi.Models.Settings;

public class MongoSettings
{
    public string ConnectionString { get; set; } = null!;
    public string DatabaseName { get; set; } = null!;
    // public string CollectionName { get; set; } = null!;
    public string UsersCollectionName { get; set; }
    public string PostsCollectionName { get; set; }
    public string CommentsCollectionName { get; set; }
}