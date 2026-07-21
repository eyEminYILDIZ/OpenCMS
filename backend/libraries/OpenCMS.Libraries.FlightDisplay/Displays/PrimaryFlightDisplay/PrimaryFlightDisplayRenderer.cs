using OpenCMS.Libraries.Common.Models;
using OpenCMS.Libraries.FlightDisplay.Rendering;
using static OpenCMS.Libraries.FlightDisplay.Common.FlightDisplayColors;
using static OpenCMS.Libraries.FlightDisplay.Common.FlightDisplayConstants;
using static OpenCMS.Libraries.FlightDisplay.Displays.PrimaryFlightDisplay.PrimaryFlightDisplayConstants;

namespace OpenCMS.Libraries.FlightDisplay.Displays.PrimaryFlightDisplay;

static class PrimaryFlightDisplayRenderer
{
    public static Canvas BuildFrame(AircraftState aircraftState)
    {
        var cv = new Canvas(W, H);
        cv.FillRect(0, 0, H, W, ' ', White, Sky);

        cv.FillRect(0, 0, 1, W, ' ', TitleFg, TitleBg);
        cv.DrawTextCentered(0, W / 2, "MavlinkPrimaryFlightDisplay", TitleFg, TitleBg);

        DrawHeadingTape(cv, aircraftState);
        DrawHorizonAndLadder(cv, aircraftState);
        DrawRollArc(cv, aircraftState);
        DrawAircraftSymbol(cv);

        DrawVerticalTape(cv, colStart: 0, colWidth: 8, rowStart: R0, rowEnd: R1,
            currentValue: aircraftState.AirSpeed, unitsPerRow: 5, labelStep: 10, minorStep: 5,
            title: "AIR SPD", unit: "MTR/SEC", pointerRight: true);

        DrawVerticalTape(cv, colStart: 52, colWidth: 8, rowStart: R0, rowEnd: R1,
            currentValue: aircraftState.Altitude, unitsPerRow: 25, labelStep: 100, minorStep: 50,
            title: "ALT MSL", unit: "METRES", pointerRight: false);

        DrawStatusPanel(cv, aircraftState);
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

    private static void DrawHeadingTape(Canvas cv, AircraftState aircraftState)
    {
        cv.FillRect(1, 0, 3, W, ' ', White, Navy);
        double centerCol = (W - 1) / 2.0;

        for (int labelVal = 0; labelVal < 360; labelVal += 10)
        {
            double diff = AngleDiff(labelVal, aircraftState.Heading);
            int col = (int)Math.Round(centerCol + diff / HeadingTapeUnitsPerCol);
            if (col < 1 || col > W - 2) continue;

            string? letter = CardinalLetter(labelVal);
            if (letter != null)
            {
                cv.FillRect(2, col - 2, 1, 5, ' ', White, Black);
                cv.DrawTextCentered(2, col, letter, White, Black);
            }
            else
            {
                cv.DrawTextCentered(2, col, labelVal.ToString(CultureInfo.InvariantCulture), White, Navy);
            }
            cv.SetChar(3, col, '|', White);
        }

        for (int labelVal = 0; labelVal < 360; labelVal += 5)
        {
            if (labelVal % 10 == 0) continue;
            double diff = AngleDiff(labelVal, aircraftState.Heading);
            int col = (int)Math.Round(centerCol + diff / HeadingTapeUnitsPerCol);
            if (col < 1 || col > W - 2) continue;
            cv.SetChar(3, col, '.', White);
        }

        cv.SetChar(1, (int)Math.Round(centerCol), '▼', White);
    }

    private static void DrawHorizonAndLadder(Canvas cv, AircraftState aircraftState)
    {
        double colCenter = ColCenter;
        double rollRad = aircraftState.RollDeg * Math.PI / 180.0;

        for (int col = C0; col <= C1; col++)
        {
            double dcol = col - colCenter;
            double hRow = BaseCenterRow - aircraftState.PitchDeg * HorizonRowsPerDeg - dcol * Math.Tan(rollRad) * HorizonAspect;
            for (int row = R0; row <= R1; row++)
            {
                double rowTop = row, rowBottom = row + 1;
                if (rowBottom <= hRow)
                {
                    cv.SetCell(row, col, ' ', White, Sky);
                }
                else if (rowTop >= hRow)
                {
                    cv.SetCell(row, col, ' ', White, Ground);
                }
                else
                {
                    // Boundary falls inside this cell: use an eighth-block glyph so the
                    // sky/ground line is antialiased at 8x vertical resolution instead of
                    // snapping to whole character rows (which looked like a staircase).
                    double skyFrac = hRow - rowTop; // portion of the cell (from the top) that is sky
                    int groundEighths = Math.Clamp((int)Math.Round((1 - skyFrac) * 8), 0, 8);
                    if (groundEighths == 0)
                        cv.SetCell(row, col, ' ', White, Sky);
                    else if (groundEighths == 8)
                        cv.SetCell(row, col, ' ', White, Ground);
                    else
                        cv.SetCell(row, col, EighthBlocks[groundEighths], Ground, Sky);
                }
            }
        }

        int cc = (int)colCenter;
        foreach (var v in LadderMajorAngles)
        {
            int row = (int)Math.Round(BaseCenterRow - (aircraftState.PitchDeg + v) * HorizonRowsPerDeg);
            if (row < R0 || row > R1) continue;
            string label = v.ToString(CultureInfo.InvariantCulture);
            cv.DrawText(row, cc - 8, label.PadLeft(3), White);
            for (int c = cc - 5; c <= cc - 2; c++) cv.SetChar(row, c, '─', White);
            for (int c = cc + 2; c <= cc + 5; c++) cv.SetChar(row, c, '─', White);
            cv.DrawText(row, cc + 6, label, White);
        }

        foreach (var v in LadderMinorAngles)
        {
            int row = (int)Math.Round(BaseCenterRow - (aircraftState.PitchDeg + v) * HorizonRowsPerDeg);
            if (row < R0 || row > R1) continue;
            for (int c = cc - 2; c <= cc + 2; c++) cv.SetChar(row, c, '-', White);
        }

        int zeroRow = (int)Math.Round(BaseCenterRow - aircraftState.PitchDeg * HorizonRowsPerDeg) - 2;
        if (zeroRow >= R0 && zeroRow <= R1) cv.DrawTextCentered(zeroRow, cc, "0", White);
    }

    private static void DrawRollArc(Canvas cv, AircraftState aircraftState)
    {
        double colCenter = ColCenter;

        foreach (var a in RollArcTickAngles)
        {
            double th = a * Math.PI / 180.0;
            int r = (int)Math.Round(RollArcTopRow + RollArcRadiusRows * (1 - Math.Cos(th)));
            int c = (int)Math.Round(colCenter + RollArcRadiusCols * Math.Sin(th));
            cv.DrawTextCentered(r, c, Math.Abs(a).ToString(CultureInfo.InvariantCulture), White);
        }

        for (double a = -60; a <= 60; a += 3)
        {
            double th = a * Math.PI / 180.0;
            int r = (int)Math.Round(RollArcTopRow + RollArcRadiusRows * (1 - Math.Cos(th)));
            int c = (int)Math.Round(colCenter + RollArcRadiusCols * Math.Sin(th));
            if (r < 0 || r >= cv.Height || c < 0 || c >= cv.Width) continue;
            if (cv.Cells[r, c].Ch == ' ' || cv.Cells[r, c].Ch == '\0')
                cv.SetChar(r, c, '·', White);
        }

        double rollClamped = Math.Clamp(aircraftState.RollDeg, -60, 60);
        double thr = rollClamped * Math.PI / 180.0;
        int pr = (int)Math.Round(RollArcTopRow + RollArcRadiusRows * (1 - Math.Cos(thr)));
        int pc = (int)Math.Round(colCenter + RollArcRadiusCols * Math.Sin(thr));
        cv.SetChar(Math.Max(pr - 1, 0), pc, '▲', White);
    }

    private static void DrawAircraftSymbol(Canvas cv)
    {
        int row = 17;
        int cc = (int)ColCenter;
        for (int c = cc - 10; c <= cc - 5; c++) cv.SetChar(row, c, '─', White);
        for (int c = cc + 5; c <= cc + 10; c++) cv.SetChar(row, c, '─', White);
        cv.SetChar(row + 1, cc - 5, '|', White);
        cv.SetChar(row + 1, cc + 5, '|', White);
        cv.SetChar(row, cc, '◆', White);
    }

    private static void DrawVerticalTape(Canvas cv, int colStart, int colWidth, int rowStart, int rowEnd,
        double currentValue, double unitsPerRow, double labelStep, double minorStep,
        string title, string unit, bool pointerRight)
    {
        int centerRow = (rowStart + rowEnd) / 2;

        for (int row = rowStart; row <= rowEnd; row++)
        {
            var bg = row < centerRow ? Navy : Olive;
            cv.FillRect(row, colStart, 1, colWidth, ' ', White, bg);
        }

        for (int row = rowStart; row <= rowEnd; row++)
        {
            if (row >= centerRow - 1 && row <= centerRow + 1) continue;

            double value = currentValue + (centerRow - row) * unitsPerRow;
            double nearestLabel = Math.Round(value / labelStep) * labelStep;
            if (Math.Abs(value - nearestLabel) < unitsPerRow / 2.0)
            {
                string text = ((int)Math.Round(nearestLabel)).ToString(CultureInfo.InvariantCulture);
                if (pointerRight)
                {
                    int textCol = colStart + colWidth - 2 - text.Length;
                    cv.DrawText(row, textCol, text, White);
                    cv.SetChar(row, colStart + colWidth - 1, '-', White);
                }
                else
                {
                    cv.DrawText(row, colStart + 1, text, White);
                    cv.SetChar(row, colStart, '-', White);
                }
            }
            else
            {
                double nearestMinor = Math.Round(value / minorStep) * minorStep;
                if (Math.Abs(value - nearestMinor) < unitsPerRow / 2.0)
                {
                    if (pointerRight) cv.SetChar(row, colStart + colWidth - 1, '-', White);
                    else cv.SetChar(row, colStart, '-', White);
                }
            }
        }

        cv.FillRect(centerRow - 1, colStart, 3, colWidth, ' ', White, Black);
        cv.DrawTextCentered(centerRow - 1, colStart + colWidth / 2, title, White, Black);
        cv.DrawTextCentered(centerRow, colStart + colWidth / 2, ((int)Math.Round(currentValue)).ToString(CultureInfo.InvariantCulture), White, Black);
        cv.DrawTextCentered(centerRow + 1, colStart + colWidth / 2, unit, White, Black);

        if (pointerRight) cv.SetChar(centerRow, colStart + colWidth - 1, '►', White);
        else cv.SetChar(centerRow, colStart, '◄', White);
    }

    private static void DrawStatusPanel(Canvas cv, AircraftState aircraftState)
    {
        cv.FillRect(30, 0, 4, W, ' ', White, Black);

        string line1 = string.Format(CultureInfo.InvariantCulture,
            "LAT {0,9:F4}  LON {1,9:F4}",
            aircraftState.Latitude, aircraftState.Longitude);
        string line2 = string.Format(CultureInfo.InvariantCulture,
            "HDG {0,5:F1}  ALT {1,7:F1}m",
            aircraftState.Heading, aircraftState.Altitude);
        string line3 = string.Format(CultureInfo.InvariantCulture,
            "SPD {0,5:F1}  GS {1,5:F1}  VSI {2,5:F1}",
            aircraftState.AirSpeed, aircraftState.GroundSpeed, aircraftState.VerticalSpeed);
        string line4 = string.Format(CultureInfo.InvariantCulture,
            "P{0,5:F1} R{1,5:F1}  {2:HH:mm:ss}  Q:quit",
            aircraftState.PitchDeg, aircraftState.RollDeg, DateTime.Now);

        cv.DrawText(30, 2, line1, White, Black);
        cv.DrawText(31, 2, line2, White, Black);
        cv.DrawText(32, 2, line3, White, Black);
        cv.DrawText(33, 2, line4, White, Black);
    }
}
