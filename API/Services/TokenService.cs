using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;

namespace API.Services;

public class TokenService(IConfiguration config, UserManager<AppUser> userManager) : ITokenService
{
   public async Task<string> CreateToken(AppUser user)
{
    var tokenKey = config["TokenKey"] ?? throw new Exception("TokenKey is not configured in appsettings.json");
    if (tokenKey.Length < 64)
    {
        throw new Exception("TokenKey must be at least 64 characters long");
    }

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

    var claims = new List<Claim>
    {
        new(ClaimTypes.NameIdentifier, user.Id.ToString()), // Corrected
        new(ClaimTypes.Name, user.UserName ?? throw new Exception("UserName is null"))
    };

    var roles = await userManager.GetRolesAsync(user);
    Console.WriteLine($"User {user.UserName} roles: {string.Join(", ", roles)}"); // Debug log
    claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

    var tokenDescriptor = new SecurityTokenDescriptor
    {
        Subject = new ClaimsIdentity(claims),
        Expires = DateTime.Now.AddDays(7),
        SigningCredentials = creds
    };

    var tokenHandler = new JwtSecurityTokenHandler();
    var token = tokenHandler.CreateToken(tokenDescriptor);
    return tokenHandler.WriteToken(token);
}

}
