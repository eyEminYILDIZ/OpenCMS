import { cn } from '../../lib/utils';

type BadgeVariant = 'primary' | 'secondary' | 'muted';

interface BadgeProps {
  count: number;
  variant?: BadgeVariant;
  className?: string;
}

const Badge = ({ count, variant = 'primary', className }: BadgeProps) => (
  <span className={cn('badge-count', `badge-count-${variant}`, className)}>
    {count}
  </span>
);

export default Badge;
