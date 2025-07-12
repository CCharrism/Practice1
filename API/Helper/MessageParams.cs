using System;

namespace API.Helper;

public class MessageParams : PaginationParams
{
    public required string Username { get; set; }

    public string Container { get; set; } = "Unread";

}
