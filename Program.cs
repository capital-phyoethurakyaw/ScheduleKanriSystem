using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using ScheduleKanriSystem.Data;
using ScheduleKanriSystem.Middleware;
using ScheduleKanriSystem.Models;
using ScheduleKanriSystem.Utilities;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Register JwtService
builder.Services.AddScoped<JwtService>();

// Configure CORS policy to allow all origins, methods, and headers (if necessary)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Register custom services for Dependency Injection (DI)
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

// Configure JWT Authentication
var jwt = builder.Configuration.GetSection("Jwt").Get<JwtModel>();
var key = new byte[64];
if (jwt != null)
{
    if (!string.IsNullOrWhiteSpace(jwt.Key))
    {
        key = Encoding.UTF8.GetBytes(jwt.Key);
    }

    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwt.Issuer,
            ValidAudience = jwt.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ClockSkew = TimeSpan.Zero
        };
    });
}

// Add authorization services
builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
}
//app.UseMiddleware<TenantMiddleware>();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();
app.UseDeveloperExceptionPage();

app.MapControllerRoute(
    name: "tenantRoute",
    pattern: "0/[controller]/{action=HomePage}/{id?}");

app.MapGet("/", () => Results.Redirect("/0/Tenant/HomePage"));

app.Run();

