using System;
using API.DTOs;
using API.Entities;

namespace API.Interfaces;

public interface ILikesRepository
{
    Task<UserLike?> GetUserLike(int sourceUserId, int targetUserId);
    Task<IEnumerable<MemberDto>> GetUserLikes(string predicate, int userId);

    Task<IEnumerable<int>> GetCurrentUserLikeIds(int currentUserId);

    void DeleteUserLike(UserLike userLike);

    void AddUserLike(UserLike userLike);
    Task<bool> SaveChanges();

}
