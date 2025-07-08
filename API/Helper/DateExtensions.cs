using System;

namespace API.Helper;

public static class DateExtensions
{
    public static int CalculateAge(this DateOnly dob)
    {
        var today = DateOnly.FromDateTime(DateTime.Now);
        var age = today.Year - dob.Year;
        
        if (dob.AddYears(age) > today)
            age--;
            
        return age;
    }
}
