using FluentValidation;

namespace OpenCMS.CMS.Application.Dispatches.Self.ListFiltered;

public class Validator : AbstractValidator<Query>
{
    public Validator()
    {
        RuleFor(x => x.RelatedEntityId)
            .NotEmpty().WithMessage("RelatedEntityId is required.");
    }
}
