using System;
using System.Reflection.Metadata.Ecma335;
using API.Entities;
using API.Extentions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers;

public class LikesController(ILikesRepository likesRepository, IUserRepository userRepository) : BaseApiController
{
    [HttpPost("{targetUserId:int}")]
    public async Task<ActionResult> toggleLike(int targetUserId)
    {
        var sourceUserName = User.GetUserName();
        var sourceUser = await userRepository.GetUserByUsernameAsync(sourceUserName);
        
        if (sourceUser == null)
        {
            return BadRequest("Source user not found");
        }
        
        var sourceUserId = sourceUser.Id;
        
        if (sourceUserId == targetUserId)
        {
            return BadRequest("You cannot like yourself");
        }
        var existingLikes = await likesRepository.GetUserLike(sourceUserId, targetUserId);

        if (existingLikes == null)
        {
            var like = new UserLike
            {
                SourceUserId = sourceUserId,
                TargetUserId = targetUserId
            };
            likesRepository.AddUserLike(like);

        }
        else
        {
            likesRepository.DeleteUserLike(existingLikes);
        }
        if (await likesRepository.SaveChanges())
        {
            return Ok();
        }

        return BadRequest("Failed to update like");
    }

    [HttpGet("list")]
    public async Task<ActionResult<IEnumerable<int>>> GetCurrentUserLikeIds()
    {
        var sourceUserName = User.GetUserName();
        var sourceUser = await userRepository.GetUserByUsernameAsync(sourceUserName);
        
        if (sourceUser == null)
        {
            return BadRequest("User not found");
        }
        
        return Ok(await likesRepository.GetCurrentUserLikeIds(sourceUser.Id));
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<int>>> GetUserLikes(string predicate)
    {
        var sourceUserName = User.GetUserName();
        var sourceUser = await userRepository.GetUserByUsernameAsync(sourceUserName);
        
        if (sourceUser == null)
        {
            return BadRequest("User not found");
        }
        
        var users = await likesRepository.GetUserLikes(predicate, sourceUser.Id);
        return Ok(users);
    }

}
