using FluentValidation;

namespace OpenCMS.CMS.Application.Dispatches.Self.Create;

public class Validator : AbstractValidator<Command>
{
    public Validator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(200).WithMessage("Title must not exceed 200 characters.");

        RuleFor(x => x.Description)
            .MaximumLength(2000).WithMessage("Description must not exceed 2000 characters.");

        RuleFor(x => x.Category)
            .IsInEnum().WithMessage("Category is not a valid value.");

        RuleFor(x => x.OccuredAt)
            .NotEmpty().WithMessage("OccuredAt is required.");

        RuleFor(x => x.RelatedEntityId)
            .NotEmpty().WithMessage("RelatedEntityId is required.")
            .When(x => x.Category != DispatchCategories.General);
    }
}
