import type { LucideIcon } from 'lucide-react';
import type { MenuSection } from '../../../../types/layout';
import { cn } from '../../../../lib/utils';

interface GridMenuItemProps {
  section: MenuSection;
  label: string;
  badgeCount: number;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
}

const GridMenuItem = ({ label, badgeCount, icon: Icon, isActive, onClick, section }: GridMenuItemProps) => (
  <button
    type="button"
    className={cn('grid-menu-item', isActive && 'active')}
    onClick={onClick}
    aria-current={isActive ? 'page' : undefined}
    aria-label={`${label}${badgeCount > 0 ? `, ${badgeCount} items` : ''}`}
    data-section={section}
  >
    {badgeCount > 0 && <span className="grid-menu-badge" aria-hidden="true">{badgeCount}</span>}
    <Icon size={24} aria-hidden="true" />
    <span>{label}</span>
  </button>
);

export default GridMenuItem;
