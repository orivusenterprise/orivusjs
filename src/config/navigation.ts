import { NavigationConfig } from '@/types/nav';

/**
 * Navigation Configuration v2
 * 
 * Structure:
 * - mainItems: Always visible (Dashboard)
 * - groups: Collapsible module sections (auto-injected by CLI)
 * - footerItems: Bottom items (Settings, Docs)
 */
export const navigationConfig: NavigationConfig = {
    mainItems: [
        { name: 'Dashboard', href: '/', icon: 'Home' },
    ],
    groups: [
        // ORIVUS_GROUP_INJECTION_POINT
    ],
    footerItems: [
        { name: 'Documentation', href: '/docs', icon: 'BookOpen' },
        { name: 'Settings', href: '/settings', icon: 'Settings' },
    ]
};

// Legacy support: flat array for backward compatibility
export const navigation = [
    ...navigationConfig.mainItems,
    ...navigationConfig.groups.flatMap(g => g.items),
    ...navigationConfig.footerItems,
];
