namespace OpenCMS.Libraries.FlightComputer.Constants;

public static class NavigationConstants
{

    // Arc-mode geometry: ownship sits at the apex, waypoints fan out toward a
    // curved compass dome above it (same dome-projection trick as the PFD roll arc).

    /// <summary>
    /// Every display is 60 columns wide and 34 rows tall.
    /// </summary>
    public const int DisplayWidth = 60, DisplayHeight = 34;

    /// <summary>
    /// The range of the display is fixed at 5000 meters.
    /// Waypoints beyond that distance are not shown,
    /// and the distance labels are scaled to fit within that range.
    /// </summary>
    public const double RangeMeter = 5000;

    /// <summary>
    /// The field of view is 110 degrees, so waypoints more than 55 degrees off the nose are not shown.
    /// </summary>
    public const double HalfFieldOfViewDeg = 55;

    /// <summary>
    /// The dome is a circular arc with a radius of 4 rows and 25 columns, centered at (29,30).
    /// </summary>
    public const double CenterCol = 30.0;

    /// <summary>
    /// The apex of the dome is at row 29, which is the bottom of the display.
    /// </summary>
    public const double ApexRow = 29.0;

    /// <summary>
    /// The top row of the arc is at row 5, which is 24 rows above the apex.
    /// </summary>
    public const double ArcTopRow = 5.0;

    /// <summary>
    /// The dome radius is 4 rows and 25 columns, which defines the curvature of the compass arc.
    /// </summary>
    public const double DomeRadiusRows = 4.0;

    /// <summary>
    /// The dome radius is 4 rows and 25 columns, which defines the curvature of the compass arc.
    /// </summary>
    public const double DomeRadiusCols = 25.0;

    // Placed off to the side (rather than on the centerline) so they don't collide
    // with the route line and waypoint labels, which usually sit near dead-ahead.
    public const double RangeLabelBearingDeg = -42;
}
