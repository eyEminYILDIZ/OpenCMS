#:project ../OpenCMS.Agent.Library/OpenCMS.Agent.Library.csproj

using OpenCMS.Agent.Library.Utilities;

double sourceLat = 41.045524;
double sourceLon = 29.064697;
double sourceAlt = 0.0;

double targetLat = 41.048350;
double targetLon = 29.052079;
double targetAlt = 300.0;

Console.WriteLine("=== CoordinateUtils Test ===");
Console.WriteLine($"Source : ({sourceLat}, {sourceLon}, alt={sourceAlt}m)");
Console.WriteLine($"Target : ({targetLat}, {targetLon}, alt={targetAlt}m)");
Console.WriteLine();

double distance = CoordinateUtils.CalculateDistance(sourceLat, sourceLon, targetLat, targetLon);
Console.WriteLine($"Distance      : {distance:F2} m");

double heading = CoordinateUtils.CalculateHeading(sourceLat, sourceLon, targetLat, targetLon);
Console.WriteLine($"Heading       : {heading:F2}°");

double verticalAngle = CoordinateUtils.CalculateVerticalAngle(sourceLat, sourceLon, sourceAlt, targetLat, targetLon, targetAlt);
Console.WriteLine($"Vertical Angle: {verticalAngle:F2}°");
