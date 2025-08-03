using Microsoft.AspNetCore.Mvc;
using DynamicApi.Models;
using DynamicApi.Services;

namespace DynamicApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    private readonly ProductService _productService;

    public ProductController(ProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public ActionResult<List<Product>> Get() => _productService.Get();

    [HttpGet("{id}")]
    public ActionResult<Product> Get(string id)
    {
        var product = _productService.Get(id);
        if (product == null) return NotFound();
        return product;
    }

    [HttpPost]
    public ActionResult Create(Product product)
    {
        _productService.Create(product);
        return CreatedAtAction(nameof(Get), new { id = product.Id }, product);
    }

    [HttpPut("{id}")]
    public ActionResult Update(string id, Product product)
    {
        var existing = _productService.Get(id);
        if (existing == null) return NotFound();
        product.Id = id;
        _productService.Update(id, product);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public ActionResult Delete(string id)
    {
        var existing = _productService.Get(id);
        if (existing == null) return NotFound();
        _productService.Remove(id);
        return NoContent();
    }
}
