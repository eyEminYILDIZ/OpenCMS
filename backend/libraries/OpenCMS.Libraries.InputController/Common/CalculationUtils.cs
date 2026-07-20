namespace OpenCMS.Libraries.InputController.Common;

public static class CalculationUtils
{
    public static double NormalizeValue(double value, double valueMin, double valueMax, double targetMin, double targetMax)
    {
        // when value=30, valueMin=0, valueMax=45, minTarget=0, maxTarget=100 the return value should be 66
        return Math.Floor((value - valueMin) / (valueMax - valueMin) * (targetMax - targetMin) + targetMin);
    }

}