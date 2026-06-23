using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// 1. Configuração do CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirNextJs", policy =>
    {
        policy.WithOrigins("http://localhost:3000","https://calculadora-de-investimento-nu.vercel.app")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 2. Adiciona o suporte para os Controllers da Calculadora
builder.Services.AddControllers();

var app = builder.Build();

app.UseHttpsRedirection();

// 3. Ativa o CORS (Obrigatório vir antes dos Controllers)
app.UseCors("PermitirNextJs");

app.UseAuthorization();

// 4. Mapeia os endpoints
app.MapControllers();

app.Run();
