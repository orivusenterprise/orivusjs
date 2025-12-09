/**
 * Navigation Types v2
 * 
 * Supports:
 * - Flat items (Dashboard, Settings)
 * - Grouped items (modules grouped by product)
 * - Collapsible sections
 * - Active state indicators
 */

export interface NavItem {
    /** Display name */
    name: string;
    /** URL path */
    href: string;
    /** Icon name (from lucide-react) */
    icon?: string;
}

export interface NavGroup {
    /** Group title (e.g., "Social Network", "E-Commerce") */
    title: string;
    /** Icon for the group header */
    icon?: string;
    /** Child navigation items */
    items: NavItem[];
    /** Is this group collapsible? Default: true */
    collapsible?: boolean;
    /** Default collapsed state */
    defaultCollapsed?: boolean;
}

export type NavigationConfig = {
    /** Top-level items (always visible) */
    mainItems: NavItem[];
    /** Grouped items (collapsible sections) */
    groups: NavGroup[];
    /** Bottom items (settings, docs, etc.) */
    footerItems: NavItem[];
};
