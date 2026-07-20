using OpenCms.Libraries.InputController.Common;
using OpenCms.Libraries.InputController.JoySticks.LogitechExtreme3dPro.Instruments;
using OpenCms.Libraries.InputController.JoySticks.LogitechExtreme3dPro.Joystick;
using OpenCMS.Libraries.Common.Models;

public class LogitechExtreme3dProInputController : IInputController, IDisposable
{


    string? devicePath = null;
    bool rawMode = false;
    bool running = false;
    JoystickReader reader;
    ControllerState controllerState;
    ConsoleRenderer renderer;

    public void Initialize()
    {
        devicePath ??= JoystickDevice.Find("Logitech Extreme 3D") ?? JoystickDevice.ListAll().FirstOrDefault();

        if (devicePath is null)
        {
            Console.WriteLine("No joystick device found under /dev/input/js*.");
            Console.WriteLine("Plug in the joystick, then try --list-devices or pass --device /dev/input/jsN explicitly.");
            Console.WriteLine("If the device exists but can't be opened, your user may need to be in the 'input' group:");
            Console.WriteLine("  sudo usermod -aG input $USER   (then log out/in)");
            return;
        }

        Console.WriteLine($"Opening {devicePath} ...");


        try
        {
            reader = new JoystickReader(devicePath);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to open {devicePath}: {ex.Message}");
            return;
        }

        running = true;

        Thread.Sleep(300); // let the kernel's initial-state event replay settle
        controllerState = new ControllerState();
        controllerState.Calibrate(reader.State);
        renderer = new ConsoleRenderer();
    }

    public void Run()
    {
        try
        {
            while (running)
            {
                controllerState.Update(reader.State);
                renderer.Render(controllerState, devicePath, reader.IsConnected);

                if (!reader.IsConnected)
                {
                    Console.SetCursorPosition(0, 14);
                    Console.WriteLine($"Device disconnected: {reader.LastError}");
                    break;
                }

                Thread.Sleep(33); // ~30Hz
            }
        }
        catch (Exception ex)
        {
            Console.SetCursorPosition(0, 14);
            Console.WriteLine($"Error: {ex.Message}");
        }
    }

    public (ActuatorActionTypes Action, double Value) ProcessInput()
    {
        if (!reader.IsConnected)
        {
            Console.SetCursorPosition(0, 14);
            Console.WriteLine($"Device disconnected: {reader.LastError}");
            return (ActuatorActionTypes.None, 0.0);
        }

        controllerState.Update(reader.State);


        if (controllerState.Buttons[2]) // Button 3 pressed
        {
            return (ActuatorActionTypes.OpenAutopilot, 1.0);
        }
        else if (controllerState.Buttons[3]) // Button 4 pressed
        {
            return (ActuatorActionTypes.CloseAutopilot, 1.0);
        }

        if (controllerState.PitchDeg > 1)
        {
            return (ActuatorActionTypes.MoveForward, NormalizeValue(controllerState.PitchDeg, valueMin: 0, valueMax: 45, targetMin: 0, targetMax: 100));
        }
        else if (controllerState.PitchDeg < -1)
        {
            return (ActuatorActionTypes.MoveBackward, NormalizeValue(-controllerState.PitchDeg, valueMin: 0, valueMax: 45, targetMin: 0, targetMax: 100));
        }
        else if (controllerState.RollDeg > 1)
        {
            return (ActuatorActionTypes.MoveRight, NormalizeValue(controllerState.RollDeg, valueMin: 0, valueMax: 45, targetMin: 0, targetMax: 100));
        }
        else if (controllerState.RollDeg < -1)
        {
            return (ActuatorActionTypes.MoveLeft, NormalizeValue(-controllerState.RollDeg, valueMin: 0, valueMax: 45, targetMin: 0, targetMax: 100));
        }
        else if (controllerState.YawDeg > 1)
        {
            return (ActuatorActionTypes.TurnRight, NormalizeValue(controllerState.YawDeg, valueMin: 0, valueMax: 45, targetMin: 0, targetMax: 100));
        }
        else if (controllerState.YawDeg < -1)
        {
            return (ActuatorActionTypes.TurnLeft, NormalizeValue(-controllerState.YawDeg, valueMin: 0, valueMax: 45, targetMin: 0, targetMax: 100));
        }
        else if (controllerState.ThrottlePct > 1)
        {
            return (ActuatorActionTypes.MoveUp, NormalizeValue(controllerState.ThrottlePct, valueMin: 0, valueMax: 100, targetMin: 0, targetMax: 1000));
        }
        else if (controllerState.ThrottlePct < -1)
        {
            return (ActuatorActionTypes.MoveDown, NormalizeValue(-controllerState.ThrottlePct, valueMin: 0, valueMax: 100, targetMin: 0, targetMax: 1000));
        }

        throw new NotImplementedException();
    }

    private double NormalizeValue(double value, double valueMin, double valueMax, double targetMin, double targetMax)
    {
        // when value=30, valueMin=0, valueMax=45, minTarget=0, maxTarget=100 the return value should be 66
        return Math.Floor((value - valueMin) / (valueMax - valueMin) * (targetMax - targetMin) + targetMin);
    }

    public void Dispose()
    {
        reader?.Dispose();
    }
}

