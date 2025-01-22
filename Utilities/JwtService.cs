using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ScheduleKanriSystem.Utilities
{
    public class JwtService(IConfiguration configuration)
    {
        private readonly IConfiguration _configuration = configuration;
        
        public string GenerateToken(string userId, string tenantId)
        {
            var keyValue = _configuration["Jwt:Key"];
            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];

            if (string.IsNullOrEmpty(keyValue))
            {
                throw new InvalidOperationException("JWT Key is not configured.");
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, userId),
                new Claim("tenantId", tenantId),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyValue));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
