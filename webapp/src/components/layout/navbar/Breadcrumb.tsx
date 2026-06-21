import { Home, ChevronRight } from 'lucide-react';
import type { MenuSection } from '../../../types/layout';
import { useLayout } from '../../../context/LayoutContext';

const SECTION_LABELS: Record<MenuSection, string> = {
  assets:     'Assets',
  agents:     'Agents',
  operations: 'Operations',
};

const Breadcrumb = () => {
  const { activeSection } = useLayout();

  return (
    <nav className="navbar-breadcrumb breadcrumb" aria-label="breadcrumb">
      <ol className="breadcrumb-list">
        <li className="breadcrumb-item">
          <Home size={16} aria-hidden="true" />
          <span className="breadcrumb-home-label">Home</span>
        </li>
        <li className="breadcrumb-separator" aria-hidden="true">
          <ChevronRight size={16} />
        </li>
        <li className="breadcrumb-item" aria-current="page">
          <span className="breadcrumb-current">{SECTION_LABELS[activeSection]}</span>
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumb;
