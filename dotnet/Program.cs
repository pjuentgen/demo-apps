internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        var app = builder.Build();

        app.MapGet("/", () => "Hello World!");
        app.MapGet("/random-error", () => "Hello World!");
        app.MapGet("/healthy", () => "Hello World!");
        app.MapGet("/liveness", () => "Live");
        app.MapGet("/readiness", () => "Ready");

        app.Run();
    }
}
