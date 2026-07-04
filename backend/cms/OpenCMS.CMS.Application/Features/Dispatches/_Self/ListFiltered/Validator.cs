using FluentValidation;

namespace OpenCMS.CMS.Application.Dispatches.Self.ListFiltered;

public class Validator : AbstractValidator<Query>
{
    public Validator()
    {
        RuleFor(x => x.RelatedEntityId)
            .NotNull().WithMessage("RelatedEntityId is required.");
    }
}
