namespace OpenCMS.Libraries.FlightComputer.AutoPilots;

public interface IDroneActuator
{
    // amount: meter
    Task MoveDown(double amount = 1.0);
    // amount: meter
    Task MoveUp(double amount = 1.0);
    // amount: meter
    Task MoveForward(double amount = 10.0);
    // amount: meter
    Task MoveBackward(double amount = 1.0);
    // angle: degree
    Task TurnLeft(double angle = 1.0);
    // angle: degree
    Task TurnRight(double angle = 1.0);
}