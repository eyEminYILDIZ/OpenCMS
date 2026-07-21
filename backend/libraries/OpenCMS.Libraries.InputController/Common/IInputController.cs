using OpenCMS.Libraries.Common.Models;

namespace OpenCMS.Libraries.InputController.Common;

public interface IInputController
{
    bool Initialize(AircraftTypes aircraftType);
    void Dispose();

    (ActuatorActionTypes Action, double Value) ProcessInput(CancellationToken cancellationToken);
}