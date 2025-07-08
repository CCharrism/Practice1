using System;
using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helper;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<AppUser, MemberDto>()
            .ForMember(dest => dest.Age, opt => opt.MapFrom(src => DateTime.Now.Year - src.DateOfBirth.Year - (DateTime.Now.DayOfYear < src.DateOfBirth.DayOfYear ? 1 : 0)))
            .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => 
                src.Photos.FirstOrDefault(x => x.IsMain) != null ? src.Photos.FirstOrDefault(x => x.IsMain)!.Url : null));
        CreateMap<Photo, PhotoDto>();
        
    }

}
