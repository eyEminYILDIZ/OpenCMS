namespace OpenCMS.Libraries.FlightComputer.AutoPilots;

public class OpenCmsDroneAutoPilot
{
    private readonly OpenCmsFlightComputer _flightComputer;
    private readonly IDroneActuator _actuatorSystem;
    private readonly bool _loggingEnabled = false;
    private CancellationTokenSource _cancellationTokenSource;
    public bool IsRunning { get; private set; } = false;

    public OpenCmsDroneAutoPilot(OpenCmsFlightComputer flightComputer, IDroneActuator droneActuator, bool loggingEnabled = false)
    {
        _flightComputer = flightComputer;
        _actuatorSystem = droneActuator;
        _loggingEnabled = loggingEnabled;
        _cancellationTokenSource = new CancellationTokenSource();
    }

    private bool isCirclingCompleted = false;
    private bool isCircling = false;
    private bool isOrderTypeObserve = false;
    private int circleCount = 0;

    public async Task<bool> Start(CancellationToken cancellationToken)
    {
        using var linkedCts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken, _cancellationTokenSource.Token);
        var linkedToken = linkedCts.Token;

        _ = Task.Run(() => Work(linkedToken), linkedToken);
        IsRunning = true;
        Console.WriteLine("Autopilot started");
        return true;
    }

    public async Task<bool> Stop()
    {
        // Implement any necessary cleanup or stopping logic here
        _cancellationTokenSource.Cancel();
        IsRunning = false;
        Console.WriteLine("Autopilot stopped");
        return true;
    }

    private async Task Work(CancellationToken cancellationToken)
    {
        while (!cancellationToken.IsCancellationRequested)
        {
            _flightComputer.Work();

            var currentSteerPoint = _flightComputer.GetCurrentSteerPoint();
            if (currentSteerPoint == null)
            {
                throw new InvalidOperationException("No current steer point available.");
            }

            if (_loggingEnabled)
            {
                Console.WriteLine($"Target Steer Point: {currentSteerPoint.Name}");
                Console.WriteLine($"Target  => Lat: {currentSteerPoint.Latitude} \tLon: {currentSteerPoint.Longitude} \tAlt: {currentSteerPoint.Altitude} \tHeading: {currentSteerPoint.Heading} \tSpeed: {currentSteerPoint.Speed}");
                Console.WriteLine($"Current => Lat: {_flightComputer._selfAgent.Latitude} \tLon: {_flightComputer._selfAgent.Longitude} \tAlt: {_flightComputer._selfAgent.Altitude} \tHeading: {_flightComputer._selfAgent.Heading} \tSpeed: {_flightComputer._selfAgent.Speed}");
            }

            isOrderTypeObserve = currentSteerPoint.OrderType == OrderTypesContract.Observe;
            var headingChanged = false;
            var bearing = 0.0;

            // make turn if needed
            bearing = _flightComputer.GetBearingToCurrentSteerPoint();

            if (isCircling)
                bearing = (bearing - 90 + 360) % 360;

            do
            {
                var headingDifference = 0.0;
                headingDifference = bearing - _flightComputer._selfAgent.Heading;

                if (headingDifference > 0)
                {
                    await _actuatorSystem.TurnRight();
                    headingChanged = true;
                }
                else if (headingDifference < 0)
                {
                    await _actuatorSystem.TurnLeft();
                    headingChanged = true;
                }
                if (_loggingEnabled)
                {
                    System.Console.WriteLine($"Calculations: IsCircling: {isCircling}  | Difference: {headingDifference} | Bearing: {bearing} | Heading: {_flightComputer._selfAgent.Heading} ");
                }

                // await Task.Delay(100, cancellationToken);
            } while (Math.Abs(bearing - _flightComputer._selfAgent.Heading) > 1 && !cancellationToken.IsCancellationRequested);


            // make altitude adjustment if needed
            var altitudeChanged = false;
            do
            {
                var altitudeDifference = _flightComputer.GetAltitudeDifferenceToCurrentSteerPoint();
                if (altitudeDifference > 1)
                {
                    await _actuatorSystem.MoveUp();
                    altitudeChanged = true;
                }
                else if (altitudeDifference < -1)
                {
                    await _actuatorSystem.MoveDown();
                    altitudeChanged = true;
                }
            } while (Math.Abs(_flightComputer.GetAltitudeDifferenceToCurrentSteerPoint()) > 1 && !cancellationToken.IsCancellationRequested);


            // Move towards the current steer point if needed
            // var positionChanged = false;
            // var distance = _flightComputer.GetDistanceToCurrentSteerPoint();
            // if (distance > 1)
            // {
            //     await _actuatorSystem.MoveForward();
            //     positionChanged = true;
            // }

            // circling
            var distance = _flightComputer.GetDistanceToCurrentSteerPoint();
            if (distance < 500 && isOrderTypeObserve && !isCircling)
            {
                isCircling = true;
                System.Console.WriteLine("\n\n\n CIRCLE TURNED ON \n\n\n");
            }

            if (distance > 1 && !isCircling)
            {
                await _actuatorSystem.MoveForward();
            }

            if (isCircling)
            {
                await _actuatorSystem.MoveForward();

                circleCount++;
                if (circleCount >= 360)
                {
                    isCirclingCompleted = true;
                    isCircling = false;
                    circleCount = 0;
                    System.Console.WriteLine("\n\n\n CIRCLE COMPLETED \n\n\n");
                    await _flightComputer.ChangeSteerPoint();
                }
            }
            else if (distance <= 10)
            {
                // _logger.LogInformation("Reached steer point.");
                await _flightComputer.ChangeSteerPoint();
            }

            await Task.Delay(10, cancellationToken); // Adjust the delay as needed
        }
    }
}
