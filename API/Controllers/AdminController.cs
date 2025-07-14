using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class AdminController : BaseApiController
{

    [Authorize(Policy = "RequireAdminRole")]
    [HttpGet("users-with-roles")]
    public ActionResult GetUsersWithRoles()
    {
        // This is a placeholder for admin-specific actions
        return Ok("Admin data accessed successfully.");
    }
    
    [Authorize (Policy = "ModeratePhotoRole")]
    [HttpGet("photos-to-moderate")]
    public ActionResult GetPhotosForModeration()
    {
        // This is a placeholder for admin-specific actions
        return Ok("Admins or Moderators can see this.");
    }


}
