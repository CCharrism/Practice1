using System.Security.Claims;

namespace API.Extentions;

public static class ClaimsPrincipleExtentions
{
    public static string GetUserName(this ClaimsPrincipal user)
    {
        var username = user.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new Exception("Username claim not found");
        return username;
    }
}

  