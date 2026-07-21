using static OpenCMS.Libraries.FlightComputer.Constants.NavigationConstants;

namespace OpenCMS.Libraries.FlightComputer.Calculators;

public class CoordinateCalculator
{
    public static double CalculateDistance(double sourceLatitude, double sourceLongitude, double targetLatitude, double targetLongitude)
    {
        // Earth's radius in meters
        const double EarthRadiusMeters = 6371000;

        // Convert degrees to radians
        double lat1Rad = sourceLatitude * Math.PI / 180.0;
        double lon1Rad = sourceLongitude * Math.PI / 180.0;
        double lat2Rad = targetLatitude * Math.PI / 180.0;
        double lon2Rad = targetLongitude * Math.PI / 180.0;

        // Haversine formula
        double dLat = lat2Rad - lat1Rad;
        double dLon = lon2Rad - lon1Rad;

        double a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                   Math.Cos(lat1Rad) * Math.Cos(lat2Rad) *
                   Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

        double c = 2 * Math.Asin(Math.Sqrt(a));

        double distance = EarthRadiusMeters * c;

        return distance;
    }

    // write a method that calculates heading between two coordinates, first coordinate is base, second is target
    public static double CalculateHeading(double sourceLatitude, double sourceLongitude, double targetLatitude, double targetLongitude)
    {
        // Convert degrees to radians
        double lat1Rad = sourceLatitude * Math.PI / 180.0;
        double lon1Rad = sourceLongitude * Math.PI / 180.0;
        double lat2Rad = targetLatitude * Math.PI / 180.0;
        double lon2Rad = targetLongitude * Math.PI / 180.0;

        double dLon = lon2Rad - lon1Rad;

        double y = Math.Sin(dLon) * Math.Cos(lat2Rad);
        double x = Math.Cos(lat1Rad) * Math.Sin(lat2Rad) -
                   Math.Sin(lat1Rad) * Math.Cos(lat2Rad) * Math.Cos(dLon);

        double heading = Math.Atan2(y, x) * 180.0 / Math.PI;

        // Normalize heading to [0, 360)
        if (heading < 0)
            heading += 360;

        return heading;
    }

    public static double CalculateVerticalAngle(double sourceLatitude, double sourceLongitude, double sourceAltitude, double targetLatitude, double targetLongitude, double targetAltitude)
    {
        double horizontalDistance = CalculateDistance(sourceLatitude, sourceLongitude, targetLatitude, targetLongitude);
        double altDiff = targetAltitude - sourceAltitude;
        return Math.Atan2(altDiff, horizontalDistance) * 180.0 / Math.PI;
    }

    public static (int row, int col) ProjectPoint(double relBearingDeg, double frac)
    {
        double clamped = Math.Clamp(relBearingDeg, -HalfFieldOfViewDeg, HalfFieldOfViewDeg);
        double theta = clamped * Math.PI / 180.0;
        double arcRow = ArcTopRow + DomeRadiusRows * (1 - Math.Cos(theta));
        double arcCol = CenterCol + DomeRadiusCols * Math.Sin(theta);
        double row = ApexRow + frac * (arcRow - ApexRow);
        double col = CenterCol + frac * (arcCol - CenterCol);
        return ((int)Math.Round(row), (int)Math.Round(col));
    }

    public static double AngleDiff(double target, double reference)
    {
        double diff = (target - reference) % 360;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        return diff;
    }
}
