using System;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class LikesRepository(DataContext context , IMapper mapper) : ILikesRepository
{
    public void AddUserLike(UserLike userLike)
    {
        context.Likes.Add(userLike);
        
    }

    public void DeleteUserLike(UserLike userLike)
    {
        context.Likes.Remove(userLike);
    }


    public async Task<IEnumerable<int>> GetCurrentUserLikeIds(int currentUserId)
    {
        return await  context.Likes
            .Where(x => x.SourceUserId == currentUserId)
            .Select(x => x.TargetUserId)
            .ToListAsync();
    }

    public async Task<UserLike?> GetUserLike(int sourceUserId, int targetUserId)
    {
        return await context.Likes.FindAsync(sourceUserId, targetUserId);
    }

    public async Task<IEnumerable<MemberDto>> GetUserLikes(string predicate, int userId)
    {
        var likes = context.Likes.AsQueryable();

        switch (predicate)
        {

            case "liked":
                return await likes.Where(like => like.SourceUserId == userId).Select(like => like.TargetUser).ProjectTo<MemberDto>(mapper.ConfigurationProvider).ToListAsync();

            case "likedBy":
                return await likes.Where(like => like.TargetUserId == userId).Select(like => like.SourceUser).ProjectTo<MemberDto>(mapper.ConfigurationProvider).ToListAsync();
            default:
                var likesId = await GetCurrentUserLikeIds(userId);

            
                return await likes.Where(x=>x.TargetUserId==userId && likesId.Contains(x.SourceUserId))
                    .Select(x => x.SourceUser)
                    .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
                    .ToListAsync();
        }
    }

    public async Task<bool> SaveChanges()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
