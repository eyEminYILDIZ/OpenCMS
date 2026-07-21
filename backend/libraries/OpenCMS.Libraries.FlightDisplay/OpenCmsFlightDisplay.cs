using OpenCMS.Libraries.FlightComputer.Constants;
using OpenCMS.Libraries.FlightDisplay.Displays.NavigationDisplay;
using OpenCMS.Libraries.FlightDisplay.Displays.PrimaryFlightDisplay;
using OpenCMS.Libraries.FlightDisplay.Rendering;
using static OpenCMS.Libraries.FlightDisplay.Common.FlightDisplayColors;

namespace OpenCMS.Libraries.FlightDisplay;

public class OpenCmsFlightDisplay
{
    private const int Gap = 1;
    private const int TotalW = NavigationConstants.DisplayWidth + Gap + NavigationConstants.DisplayWidth;
    private const int TotalH = NavigationConstants.DisplayHeight;

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


            var aircraftState = _flightComputer._selfAgent.CreateSnapshot();
            var (waypoints, activeWaypointIndex) = _flightComputer.GetRenderSnapshot();

            var pfd = PrimaryFlightDisplayRenderer.BuildFrame(aircraftState);
            var nd = NavigationDisplayRenderer.BuildFrame(aircraftState, waypoints, activeWaypointIndex);

            var combined = new Canvas(TotalW, TotalH);
            combined.Blit(pfd, 0, 0);
            combined.FillRect(0, NavigationConstants.DisplayWidth, TotalH, Gap, '│', PanelDividerFg, PanelDividerBg);
            combined.Blit(nd, 0, NavigationConstants.DisplayWidth + Gap);

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