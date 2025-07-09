
using API.Helper;
using API.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.CodeAnalysis.Options;
using Microsoft.Extensions.Options;

namespace API.Services;

public class PhotoService : IPhotoService
{
    private readonly Cloudinary _cloudinary;
    public PhotoService(IOptions<CloudinarySettings> config)
    {
        var acc = new Account
        {
            Cloud = config.Value.CloudName,
            ApiKey = config.Value.ApiKey,
            ApiSecret = config.Value.ApiSecret
        };
        _cloudinary = new Cloudinary(acc);


    }
    public async Task<ImageUploadResult> AddPhotoAsync(IFormFile file)
    {
        if (file.Length == 0) throw new ArgumentException("File is empty");

        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, file.OpenReadStream()),
            Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face"),
            Folder = "CAPP"
        };

        return await  _cloudinary.UploadAsync(uploadParams);
    }

    public async Task<DeletionResult> DeletePhotoAsync(string publicId)
    {
        if (string.IsNullOrEmpty(publicId)) throw new ArgumentException("Public ID cannot be null or empty");

        var deleteParams = new DeletionParams(publicId);


        return await _cloudinary.DestroyAsync(deleteParams);
    }
}
