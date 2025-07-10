using System;
using System.Text.Json;
using API.Helper;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace API.Extentions;

public static class HttpExtentions
{
    public static void AddPaginationHeader<T>(this HttpResponse response, PagedList<T> data)
    {
        var paginationHeader = new PaginationHeader(data.CurrentPage, data.PageSize, data.TotalCount, data.TotalPages);
        var jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase

        };
        response.Headers.Append("Pagination", JsonSerializer.Serialize(paginationHeader, jsonOptions));
        response.Headers.Append("Access-Control-Expose-Headers", "Pagination");
        response.Headers.Append("Access-Control-Allow-Origin", "*");
    }

}
