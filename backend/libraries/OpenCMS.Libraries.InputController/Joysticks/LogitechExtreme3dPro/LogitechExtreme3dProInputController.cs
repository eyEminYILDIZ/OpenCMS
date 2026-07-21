using OpenCMS.Libraries.InputController.Common;
using OpenCMS.Libraries.InputController.JoySticks.LogitechExtreme3dPro.Instruments;
using OpenCMS.Libraries.InputController.JoySticks.LogitechExtreme3dPro.Joystick;
using OpenCMS.Libraries.Common.Models;

namespace OpenCMS.Libraries.InputController.Joysticks.LogitechExtreme3dPro;

public class LogitechExtreme3dProInputController : IInputController, IDisposable
{
    string? devicePath = null;
    bool rawMode = false;
    bool running = false;
    JoystickReader reader;
    ControllerState controllerState;
    ConsoleRenderer renderer;
    private AircraftTypes _aircraftType;
    private IActuatorMapper _actuatorMapper;

    public bool Initialize(AircraftTypes aircraftType)
    {
        _aircraftType = aircraftType;
        switch (_aircraftType)
        {
            case AircraftTypes.Drone:
                _actuatorMapper = new DroneActuatorMapper();
                break;
            default:
                throw new NotImplementedException($"Actuator mapper for aircraft type {_aircraftType} is not implemented.");
        }

        devicePath ??= JoystickDevice.Find("Logitech Extreme 3D") ?? JoystickDevice.ListAll().FirstOrDefault();

        if (devicePath is null)
        {
            Console.WriteLine("No joystick device found under /dev/input/js*.");
            Console.WriteLine("Plug in the joystick, then try --list-devices or pass --device /dev/input/jsN explicitly.");
            Console.WriteLine("If the device exists but can't be opened, your user may need to be in the 'input' group:");
            Console.WriteLine("  sudo usermod -aG input $USER   (then log out/in)");
            return false;
        }

        Console.WriteLine($"Opening {devicePath} ...");


        try
        {
            reader = new JoystickReader(devicePath);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to open {devicePath}: {ex.Message}");
            return false;
        }

        running = true;

        Thread.Sleep(300); // let the kernel's initial-state event replay settle
        controllerState = new ControllerState();
        controllerState.Calibrate(reader.State);
        renderer = new ConsoleRenderer();

        return true;
    }

    // public void Run()
    // {
    //     try
    //     {
    //         while (running)
    //         {
    //             controllerState.Update(reader.State);
    //             renderer.Render(controllerState, devicePath, reader.IsConnected);

    //             if (!reader.IsConnected)
    //             {
    //                 Console.SetCursorPosition(0, 14);
    //                 Console.WriteLine($"Device disconnected: {reader.LastError}");
    //                 break;
    //             }

    //             Thread.Sleep(33); // ~30Hz
    //         }
    //     }
    //     catch (Exception ex)
    //     {
    //         Console.SetCursorPosition(0, 14);
    //         Console.WriteLine($"Error: {ex.Message}");
    //     }
    // }

    public (ActuatorActionTypes Action, double Value) ProcessInput(CancellationToken cancellationToken)
    {
        if (!reader.IsConnected)
        {
            Console.SetCursorPosition(0, 14);
            Console.WriteLine($"Device disconnected: {reader.LastError}");
            return (ActuatorActionTypes.None, 0.0);
        }

        controllerState.Update(reader.State);

        return _actuatorMapper.MapControllerStateToActuatorAction(controllerState);
    }


    public void Dispose()
    {
        reader?.Dispose();
    }
}

