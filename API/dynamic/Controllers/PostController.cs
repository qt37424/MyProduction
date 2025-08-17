using Microsoft.AspNetCore.Mvc;
using DynamicApi.Models;
using DynamicApi.Services;

namespace DynamicApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostController : ControllerBase
{
    private readonly PostService _postService;

    public PostController(PostService postService)
    {
        _postService = postService;
    }

    [HttpGet]
    public ActionResult<List<Post>> Get() => _postService.Get();

    [HttpGet("{id}")]
    public ActionResult<Post> Get(string id)
    {
        var product = _postService.Get(id);
        if (product == null) return NotFound();
        return product;
    }

    [HttpPost]
    public ActionResult Create(Post product)
    {
        _postService.Create(product);
        return CreatedAtAction(nameof(Get), new { id = product.Id }, product);
    }

    [HttpPut("{id}")]
    public ActionResult Update(string id, Post product)
    {
        var existing = _postService.Get(id);
        if (existing == null) return NotFound();
        product.Id = id;
        _postService.Update(id, product);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public ActionResult Delete(string id)
    {
        var existing = _postService.Get(id);
        if (existing == null) return NotFound();
        _postService.Remove(id);
        return NoContent();
    }
}
