using OpenCMS.Libraries.Common.Models;

namespace OpenCms.Libraries.InputController.Common;

public interface IInputController
{
    void Initialize();
    (ActuatorActionTypes Action, double Value) ProcessInput();
}