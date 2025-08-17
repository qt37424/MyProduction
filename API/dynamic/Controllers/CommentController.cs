using Microsoft.AspNetCore.Mvc;
using DynamicApi.Models;
using DynamicApi.Services;

namespace DynamicApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentController : ControllerBase
{
    private readonly CommentService _commentService;

    public CommentController(CommentService postService)
    {
        _commentService = postService;
    }

    [HttpGet]
    public ActionResult<List<Comment>> Get() => _commentService.Get();

    [HttpGet("{id}")]
    public ActionResult<Comment> Get(string id)
    {
        var comment = _commentService.Get(id);
        if (comment == null) return NotFound();
        return comment;
    }

    [HttpPost]
    public ActionResult Create(Comment comment)
    {
        _commentService.Create(comment);
        return CreatedAtAction(nameof(Get), new { id = comment.Id }, comment);
    }

    [HttpPut("{id}")]
    public ActionResult Update(string id, Comment comment)
    {
        var existing = _commentService.Get(id);
        if (existing == null) return NotFound();
        comment.Id = id;
        _commentService.Update(id, comment);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public ActionResult Delete(string id)
    {
        var existing = _commentService.Get(id);
        if (existing == null) return NotFound();
        _commentService.Remove(id);
        return NoContent();
    }
}
