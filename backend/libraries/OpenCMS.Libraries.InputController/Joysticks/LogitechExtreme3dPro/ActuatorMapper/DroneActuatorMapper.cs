using OpenCMS.Libraries.InputController.JoySticks.LogitechExtreme3dPro.Instruments;
using OpenCMS.Libraries.Common.Models;
using OpenCMS.Libraries.InputController.Common;

namespace OpenCMS.Libraries.InputController.Joysticks.LogitechExtreme3dPro;

internal class DroneActuatorMapper : IActuatorMapper
{
    public (ActuatorActionTypes Action, double Value) MapControllerStateToActuatorAction(ControllerState controllerState)
    {
        if (controllerState.Buttons[4]) // Button 5 pressed
        {
            return (ActuatorActionTypes.OpenAutopilot, 1.0);
        }
        else if (controllerState.Buttons[5]) // Button 6 pressed
        {
            return (ActuatorActionTypes.CloseAutopilot, 1.0);
        }

        if (controllerState.PitchDeg > 1)
        {
            return (ActuatorActionTypes.MoveBackward, CalculationUtils.NormalizeValue(controllerState.PitchDeg, valueMin: 0, valueMax: 45, targetMin: 0, targetMax: 10));
        }
        else if (controllerState.PitchDeg < -1)
        {
            return (ActuatorActionTypes.MoveForward, CalculationUtils.NormalizeValue(-controllerState.PitchDeg, valueMin: 0, valueMax: 45, targetMin: 0, targetMax: 10));
        }
        else if (controllerState.RollDeg > 1)
        {
            return (ActuatorActionTypes.MoveRight, CalculationUtils.NormalizeValue(controllerState.RollDeg, valueMin: 0, valueMax: 45, targetMin: 0, targetMax: 10));
        }
        else if (controllerState.RollDeg < -1)
        {
            return (ActuatorActionTypes.MoveLeft, CalculationUtils.NormalizeValue(-controllerState.RollDeg, valueMin: 0, valueMax: 45, targetMin: 0, targetMax: 10));
        }
        else if (controllerState.YawDeg > 1)
        {
            return (ActuatorActionTypes.TurnRight, CalculationUtils.NormalizeValue(controllerState.YawDeg, valueMin: 0, valueMax: 45, targetMin: 0, targetMax: 2));
        }
        else if (controllerState.YawDeg < -1)
        {
            return (ActuatorActionTypes.TurnLeft, CalculationUtils.NormalizeValue(-controllerState.YawDeg, valueMin: 0, valueMax: 45, targetMin: 0, targetMax: 2));
        }
        else if (controllerState.Buttons[2])// Assuming Button 3 for moving up
        {
            return (ActuatorActionTypes.MoveUp, CalculationUtils.NormalizeValue(controllerState.ThrottlePct, valueMin: 0, valueMax: 100, targetMin: 0, targetMax: 10));
        }
        else if (controllerState.Buttons[3]) // Assuming Button 4 for moving down
        {
            return (ActuatorActionTypes.MoveDown, CalculationUtils.NormalizeValue(controllerState.ThrottlePct, valueMin: 0, valueMax: 100, targetMin: 0, targetMax: 10));
        }
        else
        {
            return (ActuatorActionTypes.None, 0.0);
        }
    }
}