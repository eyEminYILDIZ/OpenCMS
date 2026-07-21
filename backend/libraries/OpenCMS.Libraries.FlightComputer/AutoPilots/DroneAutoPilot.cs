namespace OpenCMS.Libraries.FlightComputer.AutoPilots;

public class OpenCmsDroneAutoPilot
{
    private readonly OpenCmsFlightComputer _flightComputer;
    private readonly IDroneActuator _actuatorSystem;
    private readonly bool _loggingEnabled = false;
    private CancellationTokenSource? _internalCts;
    private CancellationTokenSource? _linkedCts;
    public bool IsRunning { get; private set; } = false;

    public OpenCmsDroneAutoPilot(OpenCmsFlightComputer flightComputer, IDroneActuator droneActuator, bool loggingEnabled = false)
    {
        _flightComputer = flightComputer;
        _actuatorSystem = droneActuator;
        _loggingEnabled = loggingEnabled;
    }

    private bool isCirclingCompleted = false;
    private bool isCircling = false;
    private bool isOrderTypeObserve = false;
    private int circleCount = 0;

    public Task<bool> Start(CancellationToken cancellationToken)
    {
        if (IsRunning)
        {
            return Task.FromResult(true);
        }

        // Dispose the previous generation's sources now that their Work loop has long since
        // observed cancellation (a fresh CancellationTokenSource is required per run since a
        // canceled source can never be un-canceled).
        _linkedCts?.Dispose();
        _internalCts?.Dispose();

        _internalCts = new CancellationTokenSource();
        _linkedCts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken, _internalCts.Token);
        var linkedToken = _linkedCts.Token;

        IsRunning = true;

        _ = Task.Run(() => Work(linkedToken), linkedToken).ContinueWith(t =>
        {
            IsRunning = false;
            if (t.Exception != null)
            {
                Console.WriteLine($"Autopilot work loop crashed: {t.Exception.GetBaseException()}");
            }
        }, TaskScheduler.Default);

        Console.WriteLine("Autopilot started");
        return Task.FromResult(true);
    }

    public Task<bool> Stop()
    {
        _internalCts?.Cancel();
        IsRunning = false;
        Console.WriteLine("Autopilot stopped");
        return Task.FromResult(true);
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
                Console.WriteLine($"Current => Lat: {_flightComputer._selfAgent.Latitude} \tLon: {_flightComputer._selfAgent.Longitude} \tAlt: {_flightComputer._selfAgent.Altitude} \tHeading: {_flightComputer._selfAgent.Heading} \tSpeed: {_flightComputer._selfAgent.GroundSpeed}");
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
