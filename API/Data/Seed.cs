using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class Seed
{
    public static async Task SeedUsers(DataContext context)
    {
        // SEEDING COMPLETE - Disabled to prevent re-seeding
        const bool ENABLE_SEEDING = false;
        
        if (!ENABLE_SEEDING) return;
        
        // Clear existing users first
        if (await context.Users.AnyAsync()) 
        {
            Console.WriteLine("Clearing existing users from database...");
            var existingUsers = await context.Users.ToListAsync();
            context.Users.RemoveRange(existingUsers);
            await context.SaveChangesAsync();
            Console.WriteLine("Existing users cleared.");
        }

        Console.WriteLine("Starting database seeding...");
        
        // Read the JSON file
        var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");
        
        // Deserialize the JSON data
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var users = JsonSerializer.Deserialize<List<SeedUser>>(userData, options);

        if (users == null) 
        {
            Console.WriteLine("No user data found in JSON file.");
            return;
        }

        Console.WriteLine($"Found {users.Count} users to seed.");

        // Create users with hashed passwords
        foreach (var seedUser in users)
        {
            using var hmac = new HMACSHA512();
            
            var user = new AppUser
            {
                UserName = seedUser.UserName.ToLower(),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Pa$$w0rd")), // Default password
                PasswordSalt = hmac.Key,
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

            context.Users.Add(user);
        }

        await context.SaveChangesAsync();
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
