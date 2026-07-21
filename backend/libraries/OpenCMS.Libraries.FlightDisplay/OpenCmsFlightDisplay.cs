using OpenCMS.Libraries.FlightDisplay.Common;
using OpenCMS.Libraries.FlightDisplay.Displays.NavigationDisplay;
using OpenCMS.Libraries.FlightDisplay.Displays.PrimaryFlightDisplay;
using OpenCMS.Libraries.FlightDisplay.Rendering;

namespace OpenCMS.Libraries.FlightDisplay;

public class OpenCmsFlightDisplay
{
    private const int Gap = 1;
    private const int TotalW = FlightDisplayConstants.W + Gap + FlightDisplayConstants.W;
    private const int TotalH = FlightDisplayConstants.H;
    private readonly (byte, byte, byte) dividerFg = ((byte)90, (byte)90, (byte)90);
    private readonly (byte, byte, byte) dividerBg = ((byte)0, (byte)0, (byte)0);

    private readonly OpenCmsFlightComputer _flightComputer;

    public OpenCmsFlightDisplay(OpenCmsFlightComputer flightComputer)
    {
        _flightComputer = flightComputer;
    }

    public bool Initialize()
    {
        Console.OutputEncoding = Encoding.UTF8;

        if (!Console.IsInputRedirected && Console.KeyAvailable)
        {
            var key = Console.ReadKey(true);
            if (key.Key == ConsoleKey.Q || key.Key == ConsoleKey.Escape) return false;
        }

        Console.Clear();

        return true;
    }

    public bool Render()
    {
        try
        {
            var aircraftState = _flightComputer._selfAgent;
            var waypoints = _flightComputer.GetWayPoints();
            var activeWaypointIndex = _flightComputer.GetActiveWaypointIndex();

            var pfd = PrimaryFlightDisplayRenderer.BuildFrame(aircraftState);
            var nd = NavigationDisplayRenderer.BuildFrame(aircraftState, waypoints, activeWaypointIndex);

            var combined = new Canvas(TotalW, TotalH);
            combined.Blit(pfd, 0, 0);
            combined.FillRect(0, FlightDisplayConstants.W, TotalH, Gap, '│', dividerFg, dividerBg);
            combined.Blit(nd, 0, FlightDisplayConstants.W + Gap);

            Console.Write("\x1b[H");
            Console.Out.Write(combined.ToAnsi());
            Console.Out.Flush();

            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error rendering flight display: {ex.Message}");
            return false;
        }
    }
}