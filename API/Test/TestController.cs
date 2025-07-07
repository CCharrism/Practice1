using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("[controller]")]
public class TestController : ControllerBase
{
    [HttpGet("throw")]
    public IActionResult ThrowException()
    {
        
        throw new InvalidOperationException("This is a test exception.");
    }
}
