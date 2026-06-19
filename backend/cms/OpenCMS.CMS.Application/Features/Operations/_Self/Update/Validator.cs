using FluentValidation;

namespace OpenCMS.CMS.Application.Operations.Self.Update;

public class Validator : AbstractValidator<Command>
{
    public Validator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Id is required.");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MaximumLength(200).WithMessage("Name must not exceed 200 characters.");

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters.");

        RuleFor(x => x.StartDate)
            .NotEmpty().WithMessage("StartDate is required.");

        RuleFor(x => x.EstimatedEndDate)
            .NotEmpty().WithMessage("EstimatedEndDate is required.")
            .GreaterThan(x => x.StartDate).WithMessage("EstimatedEndDate must be after StartDate.");

        RuleFor(x => x.OperationStatus)
            .IsInEnum().WithMessage("OperationStatus is not a valid value.");

        RuleFor(x => x.OperationType)
            .IsInEnum().WithMessage("OperationType is not a valid value.");
    }
}
