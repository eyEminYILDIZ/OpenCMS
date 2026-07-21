using OpenCMS.Libraries.Common.Models;
using OpenCMS.Libraries.FlightDisplay.Rendering;
using static OpenCMS.Libraries.FlightDisplay.Common.FlightDisplayColors;
using static OpenCMS.Libraries.FlightDisplay.Common.FlightDisplayConstants;
using static OpenCMS.Libraries.FlightDisplay.Displays.NavigationDisplay.NavigationDisplayConstants;

namespace OpenCMS.Libraries.FlightDisplay.Displays.NavigationDisplay;

static class NavigationDisplayRenderer
{
    private readonly record struct ProjectedWaypoint(
        Waypoint Wp, string Name, double DistanceMeters, double BearingDeg, double RelBearingDeg, bool InView, int Row, int Col);

    public static Canvas BuildFrame(AircraftState aircraftState, List<Waypoint> waypoints, int activeWaypointIndex)
    {
        var cv = new Canvas(W, H);
        cv.FillRect(0, 0, H, W, ' ', White, Black);

        cv.FillRect(0, 0, 1, W, ' ', TitleFg, TitleBg);
        cv.DrawTextCentered(0, W / 2, "MavlinkNavigationDisplay", TitleFg, TitleBg);

        var pts = ProjectWaypoints(aircraftState, waypoints);

        DrawRangeTicks(cv);
        DrawCompassArc(cv, aircraftState);
        DrawRoute(cv, aircraftState, pts, activeWaypointIndex);
        DrawAircraftSymbol(cv);
        DrawTopInfo(cv, aircraftState);
        DrawSteerpointPanel(cv, aircraftState, pts, activeWaypointIndex);
        DrawStatusPanel(cv, aircraftState, pts, activeWaypointIndex);

        return cv;
    }

    private static double AngleDiff(double target, double reference)
    {
        double diff = (target - reference) % 360;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        return diff;
    }

    private static string? CardinalLetter(int deg) => deg switch
    {
        0 => "N",
        90 => "E",
        180 => "S",
        270 => "W",
        _ => null,
    };

    private static (int row, int col) ProjectPoint(double relBearingDeg, double frac)
    {
        double clamped = Math.Clamp(relBearingDeg, -HalfFieldOfViewDeg, HalfFieldOfViewDeg);
        double theta = clamped * Math.PI / 180.0;
        double arcRow = ArcTopRow + DomeRadiusRows * (1 - Math.Cos(theta));
        double arcCol = CenterCol + DomeRadiusCols * Math.Sin(theta);
        double row = ApexRow + frac * (arcRow - ApexRow);
        double col = CenterCol + frac * (arcCol - CenterCol);
        return ((int)Math.Round(row), (int)Math.Round(col));
    }

    private static List<ProjectedWaypoint> ProjectWaypoints(AircraftState aircraftState, List<Waypoint> wayPoints)
    {
        var list = new List<ProjectedWaypoint>();
        foreach (var wp in wayPoints)
        {
            double distance = CoordinateCalculator.CalculateDistance(aircraftState.Latitude, aircraftState.Longitude, wp.Latitude, wp.Longitude);
            double bearing = CoordinateCalculator.CalculateHeading(aircraftState.Latitude, aircraftState.Longitude, wp.Latitude, wp.Longitude);
            double relativeBearing = AngleDiff(bearing, aircraftState.Heading);
            double frac = Math.Clamp(distance / RangeMeter, 0, 1);
            var (row, col) = ProjectPoint(relativeBearing, frac);
            bool inView = Math.Abs(relativeBearing) <= HalfFieldOfViewDeg && distance <= RangeMeter;
            list.Add(new ProjectedWaypoint(wp, wp.Name, distance, bearing, relativeBearing, inView, row, col));
        }
        return list;
    }

    /// <summary>
    /// Formats the estimated time enroute (ETE) to a waypoint based on the distance in meters and the ground speed in meters per second.
    /// </summary>
    /// <param name="distanceMeters"></param>
    /// <param name="groundSpeedMps"></param>
    /// <returns></returns>
    private static string FormatEte(double distanceMeters, double groundSpeedMps)
    {
        if (groundSpeedMps < 0.5) return "--:--";
        int totalSeconds = (int)Math.Round(distanceMeters / groundSpeedMps);
        int mm = totalSeconds / 60;
        int ss = totalSeconds % 60;
        return string.Format(CultureInfo.InvariantCulture, "{0:00}:{1:00}", mm, ss);
    }

    private static string Truncate(string s, int maxLen) => s.Length <= maxLen ? s : s[..maxLen];

    private static void DrawLine(Canvas cv, int r0, int c0, int r1, int c1, char ch, (byte, byte, byte) color)
    {
        int dr = Math.Abs(r1 - r0), dc = Math.Abs(c1 - c0);
        int sr = r0 < r1 ? 1 : -1;
        int sc = c0 < c1 ? 1 : -1;
        int err = dr - dc;
        int r = r0, c = c0;
        while (true)
        {
            cv.SetChar(r, c, ch, color);
            if (r == r1 && c == c1) break;
            int e2 = 2 * err;
            if (e2 > -dc) { err -= dc; r += sr; }
            if (e2 < dr) { err += dr; c += sc; }
        }
    }

    private static void DrawRangeTicks(Canvas cv)
    {
        // Stop short of 1.0: at full range the label would sit right on the compass dome.
        for (double frac = 0.25; frac <= 0.76; frac += 0.25)
        {
            var (row, col) = ProjectPoint(RangeLabelBearingDeg, frac);
            if (row < (int)ArcTopRow || row > (int)ApexRow) continue;
            int meters = (int)Math.Round(RangeMeter * frac);
            cv.SetChar(row, col - 1, '-', Gray);
            cv.DrawText(row, col, meters.ToString(CultureInfo.InvariantCulture), Gray);
        }
    }

    private static void DrawCompassArc(Canvas cv, AircraftState aircraftState)
    {
        string hdgText = ((int)Math.Round(aircraftState.Heading) % 360).ToString("000", CultureInfo.InvariantCulture);
        int cc = (int)CenterCol;
        cv.DrawText(1, cc - 8, "HDG", Green);
        cv.FillRect(1, cc - 2, 1, 5, ' ', White, Black);
        cv.DrawTextCentered(1, cc, hdgText, White, Black);
        cv.DrawText(1, cc + 5, "MAG", Green);
        cv.SetChar(2, cc, '▼', White);

        for (int labelVal = 0; labelVal < 360; labelVal += 10)
        {
            double rel = AngleDiff(labelVal, aircraftState.Heading);
            if (Math.Abs(rel) > HalfFieldOfViewDeg) continue;
            double theta = rel * Math.PI / 180.0;
            int row = (int)Math.Round(ArcTopRow + DomeRadiusRows * (1 - Math.Cos(theta)));
            int col = (int)Math.Round(CenterCol + DomeRadiusCols * Math.Sin(theta));

            string? letter = CardinalLetter(labelVal);
            if (letter != null)
            {
                cv.FillRect(row - 1, col - 2, 1, 5, ' ', White, Black);
                cv.DrawTextCentered(row - 1, col, letter, White, Black);
            }
            else
            {
                string tick = (labelVal / 10).ToString("00", CultureInfo.InvariantCulture);
                cv.DrawTextCentered(row - 1, col, tick, White);
            }
            cv.SetChar(row, col, '┴', White);
        }

        for (int labelVal = 0; labelVal < 360; labelVal += 5)
        {
            if (labelVal % 10 == 0) continue;
            double rel = AngleDiff(labelVal, aircraftState.Heading);
            if (Math.Abs(rel) > HalfFieldOfViewDeg) continue;
            double theta = rel * Math.PI / 180.0;
            int row = (int)Math.Round(ArcTopRow + DomeRadiusRows * (1 - Math.Cos(theta)));
            int col = (int)Math.Round(CenterCol + DomeRadiusCols * Math.Sin(theta));
            cv.SetChar(row, col, '·', White);
        }
    }

    private static void DrawRoute(Canvas cv, AircraftState aircraftState, List<ProjectedWaypoint> pts, int activeWaypointIndex)
    {
        if (pts.Count == 0) return;
        int startIdx = activeWaypointIndex;
        var prevPoint = ((int)ApexRow, (int)CenterCol);

        for (int i = startIdx; i < pts.Count; i++)
        {
            var p = pts[i];
            var legColor = i == startIdx ? Cyan : Magenta;
            DrawLine(cv, prevPoint.Item1, prevPoint.Item2, p.Row, p.Col, '·', legColor);
            prevPoint = (p.Row, p.Col);
        }

        for (int i = startIdx; i < pts.Count; i++)
        {
            var p = pts[i];
            if (!p.InView) continue;

            var markColor = i == startIdx ? Cyan : Green;
            cv.SetChar(p.Row, p.Col, '◇', markColor);
            cv.DrawText(p.Row - 1, p.Col - p.Wp.Name.Length / 2, p.Wp.Name, Green);

            string distLabel = string.Format(CultureInfo.InvariantCulture,
                "{0:F0}m {1}", p.DistanceMeters, FormatEte(p.DistanceMeters, aircraftState.GroundSpeed));
            cv.DrawText(p.Row + 1, p.Col - distLabel.Length / 2, distLabel, White);
        }
    }

    private static void DrawAircraftSymbol(Canvas cv)
    {
        int row = (int)ApexRow;
        int cc = (int)CenterCol;
        cv.SetChar(row - 1, cc, '▲', White);
        for (int c = cc - 4; c <= cc - 2; c++) cv.SetChar(row, c, '─', White);
        for (int c = cc + 2; c <= cc + 4; c++) cv.SetChar(row, c, '─', White);
        cv.SetChar(row, cc - 1, '\\', White);
        cv.SetChar(row, cc + 1, '/', White);
    }

    private static void DrawTopInfo(Canvas cv, AircraftState aircraftState)
    {
        cv.DrawText(1, 2, string.Format(CultureInfo.InvariantCulture, "GS  {0,3:F0}", aircraftState.GroundSpeed), Green);
        cv.DrawText(2, 2, string.Format(CultureInfo.InvariantCulture, "TAS {0,3:F0}", aircraftState.AirSpeed), Green);
    }

    private static void DrawSteerpointPanel(Canvas cv, AircraftState aircraftState, List<ProjectedWaypoint> pts, int activeWaypointIndex)
    {
        if (pts.Count == 0) return;
        var active = pts[activeWaypointIndex];

        // Dedicated "to waypoint" readout: always visible, bottom-right of the display.
        int panelCol = W - 19;
        cv.DrawText(26, panelCol, "TO " + active.Wp.Name, Magenta);
        cv.DrawText(27, panelCol, string.Format(CultureInfo.InvariantCulture, "DST {0,5:F0}M", active.DistanceMeters), White);
        cv.DrawText(28, panelCol, "TM  " + FormatEte(active.DistanceMeters, aircraftState.GroundSpeed), White);
    }

    private static void DrawStatusPanel(Canvas cv, AircraftState aircraftState, List<ProjectedWaypoint> pts, int activeWaypointIndex)
    {
        cv.FillRect(30, 0, 4, W, ' ', White, Black);

        string line1 = string.Format(CultureInfo.InvariantCulture,
            "LAT {0,9:F4}  LON {1,9:F4}",
            aircraftState.Latitude, aircraftState.Longitude);
        string line2 = string.Format(CultureInfo.InvariantCulture,
            "HDG {0,5:F1}  GS {1,5:F1}m/s  ALT{2,7:F1}m",
            aircraftState.Heading, aircraftState.GroundSpeed, aircraftState.Altitude);

        string line3;
        if (pts.Count > 0)
        {
            var active = pts[activeWaypointIndex];
            line3 = string.Format(CultureInfo.InvariantCulture,
                "TO {0,-6} BRG{1,5:F1} DST{2,6:F0}M ETE {3}",
                active.Wp.Name, active.BearingDeg, active.DistanceMeters, FormatEte(active.DistanceMeters, aircraftState.GroundSpeed));
        }
        else
        {
            line3 = "TO  ---";
        }

        string route = string.Join(" ", pts.Select((wp, i) => i == activeWaypointIndex ? $">{wp.Name}<" : wp.Name));
        string line4 = string.Format(CultureInfo.InvariantCulture,
            "RTE {0}  {1:HH:mm:ss} Q:quit", route, DateTime.Now);

        cv.DrawText(30, 2, line1, White, Black);
        cv.DrawText(31, 2, line2, White, Black);
        cv.DrawText(32, 2, line3, White, Black);
        cv.DrawText(33, 2, Truncate(line4, W - 4), White, Black);
    }
}
