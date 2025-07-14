
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class Seed
{
    public static async Task SeedUsers(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
    {
        const bool ENABLE_SEEDING = true;
        if (!ENABLE_SEEDING) return;

        if (await userManager.Users.AnyAsync())
        {
            Console.WriteLine("Users already exist in database. Skipping seeding.");
            return;
        }

        Console.WriteLine("Starting database seeding...");

        var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var users = JsonSerializer.Deserialize<List<SeedUser>>(userData, options);

        if (users == null)
        {
            Console.WriteLine("No user data found in JSON file.");
            return;
        }

        var roles = new List<AppRole>
    {
        new() { Name = "Member" },
        new() { Name = "Admin" },
        new() { Name = "Moderator" }
    };

        foreach (var role in roles)
        {
            await roleManager.CreateAsync(role);
        }

        // Create normal users
        foreach (var seedUser in users)
        {
            var user = new AppUser
            {
                UserName = seedUser.UserName.ToLower(),
                DateOfBirth = DateOnly.Parse(seedUser.DateOfBirth),
                KnownAs = seedUser.KnownAs,
                Created = DateTime.Parse(seedUser.Created),
                LastActive = DateTime.Parse(seedUser.LastActive),
                Gender = seedUser.Gender,
                Introduction = seedUser.Introduction,
                Interests = seedUser.Interests,
                LookingFor = seedUser.LookingFor,
                City = seedUser.City,
                Country = seedUser.Country,
                Photos = seedUser.Photos.Select(p => new Photo
                {
                    Url = p.Url,
                    IsMain = p.IsMain
                }).ToList()
            };

            var result = await userManager.CreateAsync(user, "Pa$$w0rd");
            if (!result.Succeeded)
            {
                Console.WriteLine($"Failed to create user {seedUser.UserName}: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
            else
            {
                Console.WriteLine($"Successfully created user: {seedUser.UserName}");
                await userManager.AddToRoleAsync(user, "Member");
            }
        }

        // Create admin user separately, outside the loop
        var adminUser = new AppUser
        {
            UserName = "admin",
            KnownAs = "Admin",
            City = "",
            Country = "",
            Gender = ""
        };

        var adminResult = await userManager.CreateAsync(adminUser, "Pa$$w0rd");
        if (adminResult.Succeeded)
        {
            await userManager.AddToRoleAsync(adminUser, "Admin");
            await userManager.AddToRoleAsync(adminUser, "Moderator");
            Console.WriteLine("Successfully created admin user.");
        }
        else
        {
            Console.WriteLine($"Failed to create admin user: {string.Join(", ", adminResult.Errors.Select(e => e.Description))}");
        }

        Console.WriteLine($"Successfully seeded {users.Count} users into the database.");
        Console.WriteLine("*** SEEDING COMPLETE - You can now set ENABLE_SEEDING = false ***");
    }
}

    // Helper classes for JSON deserialization
    public class SeedUser
    {
        public string UserName { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string DateOfBirth { get; set; } = string.Empty;
        public string KnownAs { get; set; } = string.Empty;
        public string Created { get; set; } = string.Empty;
        public string LastActive { get; set; } = string.Empty;
        public string Introduction { get; set; } = string.Empty;
        public string LookingFor { get; set; } = string.Empty;
        public string Interests { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public List<SeedPhoto> Photos { get; set; } = new();
    }

    public class SeedPhoto
    {
        public string Url { get; set; } = string.Empty;
        public bool IsMain { get; set; }
    }
