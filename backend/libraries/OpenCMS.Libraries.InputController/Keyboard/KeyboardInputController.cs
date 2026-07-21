using OpenCMS.Libraries.InputController.Common;
using OpenCMS.Libraries.Common.Models;

namespace OpenCMS.Libraries.InputController.Keyboard;

public class KeyboardInputController : IInputController, IDisposable
{
    public bool Initialize(AircraftTypes aircraftType)
    {
        System.Console.WriteLine($"Keyboard Input Controller Initialized for aircraft type: {aircraftType}.");
        return true;
    }

    public (ActuatorActionTypes Action, double Value) ProcessInput(CancellationToken cancellationToken)
    {
        while (!Console.KeyAvailable)
        {
            if (cancellationToken.IsCancellationRequested)
            {
                return (ActuatorActionTypes.None, 0.0);
            }

            Thread.Sleep(10);
        }

        var readKey = Console.ReadKey(intercept: true);
        if (readKey.Key == ConsoleKey.UpArrow)
        {
            // System.Console.WriteLine("Moving Forward");
            return (ActuatorActionTypes.MoveForward, 10.0);
        }
        else if (readKey.Key == ConsoleKey.DownArrow)
        {
            // System.Console.WriteLine("Moving Backward");
            return (ActuatorActionTypes.MoveBackward, 10.0);
        }
        else if (readKey.Key == ConsoleKey.LeftArrow)
        {
            // System.Console.WriteLine("Turning Left");
            return (ActuatorActionTypes.TurnLeft, 1.0);
        }
        else if (readKey.Key == ConsoleKey.RightArrow)
        {
            // System.Console.WriteLine("Turning Right");
            return (ActuatorActionTypes.TurnRight, 1.0);
        }
        else if (readKey.Key == ConsoleKey.PageUp)
        {
            // System.Console.WriteLine("Moving Up");
            return (ActuatorActionTypes.MoveUp, 10.0);
        }
        else if (readKey.Key == ConsoleKey.PageDown)
        {
            // System.Console.WriteLine("Moving Down");
            return (ActuatorActionTypes.MoveDown, 10.0);
        }
        else if (readKey.Key == ConsoleKey.A)
        {
            // System.Console.WriteLine("Opening Autopilot");
            return (ActuatorActionTypes.OpenAutopilot, 1.0);
        }
        else if (readKey.Key == ConsoleKey.B)
        {
            // System.Console.WriteLine("Closing Autopilot");
            return (ActuatorActionTypes.CloseAutopilot, 1.0);
        }
        else
        {
            System.Console.WriteLine($"Key {readKey.Key} pressed. No action assigned.");
            return (ActuatorActionTypes.None, 0.0);
        }
    }

    public void Dispose()
    {
        System.Console.WriteLine("Keyboard Input Controller Disposed.");
    }
}
