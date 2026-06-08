import type { LucideIcon } from 'lucide-react';
import { MenuSection } from "./layout";
import { MenuTypes } from './MenuTypes';

export interface MenuConfig {
    section: MenuSection;
    label: string;
    badgeCount: number;
    icon: LucideIcon;
    type: MenuTypes;
}