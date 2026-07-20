using OpenCMS.Libraries.InputController.JoySticks.LogitechExtreme3dPro.Instruments;
using OpenCMS.Libraries.Common.Models;

namespace OpenCMS.Libraries.InputController.Joysticks.LogitechExtreme3dPro;

internal interface IActuatorMapper
{
    (ActuatorActionTypes Action, double Value) MapControllerStateToActuatorAction(ControllerState controllerState);
}