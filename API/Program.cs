using System.Text;
using API.Data;
using API.Extentions;
using API.Interfaces;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);
builder.Services.AddScoped<ITokenService, TokenService>();
var app = builder.Build();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.UseCors("AllowAngularApp");
app.UseMiddleware<ExceptionMiddleware>();



app.MapGet("/bad-request", () =>
{
    var errors = new Dictionary<string, string[]>
    {
        { "Email", new[] { "Email is required.", "Email must be valid." } },
        { "Password", new[] { "Password must be at least 6 characters." } }
    };
    return Results.BadRequest(new { errors });
});

app.MapGet("/unauthorized", () => Results.Unauthorized());

app.MapGet("/forbidden", () => Results.StatusCode(403));

app.MapGet("/not-found", () => Results.NotFound());

app.MapGet("/server-error", () =>
{
    // Throwing an exception to simulate 500 error
    throw new Exception("Simulated server error");
});

app.MapGet("/network-error", () =>
{
    // Simulate no response (you can test by stopping the server or firewall)
    // This is just a placeholder; you can't simulate network errors easily from server side
    return Results.Ok("This won't simulate network error but you can stop server manually.");
});

app.MapGet("/custom-error", () =>
{
    // Custom error with message
    return Results.Problem(detail: "Custom error occurred.", statusCode: 418, title: "I'm a teapot");
});


app.Run();
