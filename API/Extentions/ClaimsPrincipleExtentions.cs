using System.Security.Claims;

namespace API.Extentions;

public static class ClaimsPrincipleExtentions
{
    public static string GetUserName(this ClaimsPrincipal user)
    {
        var username = user.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new Exception("Username claim not found");
        return username;
    }

    public static int GetUserId(this ClaimsPrincipal user)
    {
        var userIdClaim = user.FindFirstValue("nameid");
        if (userIdClaim != null && int.TryParse(userIdClaim, out int id))
        {
            return id;
        }
        
        throw new Exception($"Could not find or parse user ID from claims. Available claims: {string.Join(", ", user.Claims.Select(c => $"{c.Type}:{c.Value}"))}");
    }
}

  