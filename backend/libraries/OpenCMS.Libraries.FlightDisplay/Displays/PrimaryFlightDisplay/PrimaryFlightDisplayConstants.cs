namespace OpenCMS.Libraries.FlightDisplay.Displays.PrimaryFlightDisplay;

static class PrimaryFlightDisplayConstants
{
    // Main horizon body geometry.
    public const int R0 = 4, R1 = 29;
    public const int C0 = 8, C1 = 51;
    public const double BaseCenterRow = 16.5;
    public static double ColCenter => (C0 + C1) / 2.0;

    // Index n = how many eighths (from the bottom) of the cell are filled.
    public static readonly char[] EighthBlocks = { ' ', '▁', '▂', '▃', '▄', '▅', '▆', '▇', '█' };

    public const double HeadingTapeUnitsPerCol = 2.0;

    public const double HorizonRowsPerDeg = 0.35;
    public const double HorizonAspect = 0.5;
    public static readonly int[] LadderMajorAngles = { -20, -10, 10, 20 };
    public static readonly int[] LadderMinorAngles = { -15, -5, 5, 15 };

    public const double RollArcTopRow = 5;
    public const double RollArcRadiusRows = 4;
    public const double RollArcRadiusCols = 20;
    public static readonly int[] RollArcTickAngles = { -60, -45, -30, -15, 15, 30, 45, 60 };
}
