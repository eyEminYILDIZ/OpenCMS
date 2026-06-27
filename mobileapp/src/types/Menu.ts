import { MenuSection } from "./layout";
import { MenuTypes } from './MenuTypes';

export interface MenuConfig {
    section: MenuSection;
    label: string;
    badgeCount: number;
    iconName: string;
    type: MenuTypes;
}
