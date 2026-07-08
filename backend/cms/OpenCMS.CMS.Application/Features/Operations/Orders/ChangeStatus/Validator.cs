using FluentValidation;

namespace OpenCMS.CMS.Application.Operations.Orders.ChangeStatus;

public class Validator : AbstractValidator<Command>
{
    public Validator()
    {
        RuleFor(x => x.OperationId)
            .NotEmpty().WithMessage("OperationId is required.");

        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Id is required.");

        RuleFor(x => x.OrderStatus)
            .IsInEnum().WithMessage("OrderStatus is not a valid value.");
    }
}
