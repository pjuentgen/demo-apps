using System.Net.Http;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        var app = builder.Build();

        app.MapGet("/", () => "Hello World!");
        app.MapGet("/random-error", () => "Hello World!");
        using System.Net.Http;

        app.MapGet("/liveness", () => "Live");
        app.MapGet("/readiness", () => "Ready");

        app.Run();
    }
}