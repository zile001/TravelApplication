using System;
using System.Collections.Generic;
using System.Fabric;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.ServiceFabric.Services.Communication.AspNetCore;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using Microsoft.ServiceFabric.Data;
using TravelService.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TravelService;
using Microsoft.EntityFrameworkCore;
namespace TravelService
{
    internal sealed class TravelService : StatefulService
    {
        public TravelService(StatefulServiceContext context)
            : base(context)
        { }

        protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners()
        {
            return new ServiceReplicaListener[]
            {
                new ServiceReplicaListener(serviceContext =>
                    new KestrelCommunicationListener(serviceContext, "ServiceEndpoint", (url, listener) =>
                    {
                        ServiceEventSource.Current.ServiceMessage(serviceContext, $"Starting Kestrel on {url}");

                        var builder = WebApplication.CreateBuilder();

                        // 1. Service Fabric Kontekst
                        builder.Services.AddSingleton<StatefulServiceContext>(serviceContext);

                        // 2. Registracija SQL Server Baze (TravelDbContext)
                        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
                            ?? "Server=(localdb)\\mssqllocaldb;Database=TravelServiceDb;Trusted_Connection=True;MultipleActiveResultSets=true;";

                        builder.Services.AddDbContext<TravelDbContext>(options =>
                            options.UseSqlServer(connectionString));

                        // 3. Registracija Repozitorijuma koji sada koristi DbContext
                        builder.Services.AddScoped<ITravelRepository, TravelRepository>();

                        // 4. Kestrel & Service Fabric Integracija
                        builder.WebHost
                            .UseKestrel()
                            .UseContentRoot(Directory.GetCurrentDirectory())
                            .UseServiceFabricIntegration(listener, ServiceFabricIntegrationOptions.None)
                            .UseUrls(url);

                        builder.Services.AddControllers();
                        builder.Services.AddEndpointsApiExplorer();
                        builder.Services.AddSwaggerGen();

                        // 5. JWT Autentifikacija
                        var jwtSecret = builder.Configuration["Jwt:Secret"]
                            ?? builder.Configuration["JwtSettings:Secret"]
                            ?? "OvoJeMojSuperTajniKljucKojiMoraBitiDovoljnoDugacak123!";

                        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                            .AddJwtBearer(options =>
                            {
                                options.TokenValidationParameters = new TokenValidationParameters
                                {
                                    ValidateIssuerSigningKey = true,
                                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
                                    ValidateIssuer = false,
                                    ValidateAudience = false,
                                    ValidateLifetime = true,
                                    ClockSkew = TimeSpan.Zero,
                                    NameClaimType = "nameid",
                                    RoleClaimType = "role"
                                };
                            });

                        var app = builder.Build();

                        if (app.Environment.IsDevelopment())
                        {
                            app.UseSwagger();
                            app.UseSwaggerUI();
                        }

                        app.UseAuthentication();
                        app.UseAuthorization();
                        app.MapControllers();

                        return app;
                    }))
            };
        }
    }
}