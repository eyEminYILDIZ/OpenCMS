using FluentValidation;

namespace OpenCMS.CMS.Application.Assets.Self.Feed;

public class Validator : AbstractValidator<Command>
{
    public Validator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Asset ID is required.");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MaximumLength(200).WithMessage("Name must not exceed 200 characters.");

        RuleFor(x => x.Latitude)
            .InclusiveBetween(-90, 90).WithMessage("Latitude must be between -90 and 90.");

        RuleFor(x => x.Longitude)
            .InclusiveBetween(-180, 180).WithMessage("Longitude must be between -180 and 180.");

        // RuleFor(x => x.Altitude)
        //     .GreaterThanOrEqualTo(0).WithMessage("Altitude must be non-negative.");

        RuleFor(x => x.Heading)
            .InclusiveBetween(0, 360).WithMessage("Heading must be between 0 and 360 degrees.");

        RuleFor(x => x.Speed)
            .GreaterThanOrEqualTo(0).WithMessage("Speed must be non-negative.");

        RuleFor(x => x.AssetType)
            .IsInEnum().WithMessage("AssetType is not a valid value.");

        RuleFor(x => x.ThreatType)
            .IsInEnum().WithMessage("ThreatType is not a valid value.");
    }
}
