import fs from "fs";
import path from "path";
import { ParsedModuleSpec } from "../../core/spec-parser";

/**
 * Registers the new module in the central navigation config.
 * v2: Supports grouped navigation by product.
 */

// Pluralization helper
function pluralize(word: string): string {
    if (word.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(word.charAt(word.length - 2).toLowerCase())) {
        return word.slice(0, -1) + 'ies';
    }
    if (word.endsWith('s') || word.endsWith('x') || word.endsWith('ch') || word.endsWith('sh')) {
        return word + 'es';
    }
    return word + 's';
}

function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function registerNavigation(
    spec: ParsedModuleSpec,
    root: string,
    productName?: string  // Optional: group modules by product
) {
    const navPath = path.join(root, "src/config/navigation.ts");

    if (!fs.existsSync(navPath)) {
        console.warn(`⚠️  Navigation config not found at ${navPath}. Skipping sidebar registration.`);
        return;
    }

    let content = fs.readFileSync(navPath, "utf-8");

    const moduleName = spec.moduleName;
    const pluralName = pluralize(moduleName);
    const displayName = capitalize(moduleName);
    const href = `/${pluralName}`;

    // Check if already exists
    if (content.includes(`href: '${href}'`)) {
        console.log(`⚠️  Navigation entry for ${moduleName} already exists.`);
        return;
    }

    const groupInjectionMarker = "// ORIVUS_GROUP_INJECTION_POINT";

    // If we have a product name, add to a group
    if (productName) {
        const groupTitle = productName;
        const groupExists = content.includes(`title: '${groupTitle}'`);

        if (groupExists) {
            // Add to existing group
            const groupPattern = new RegExp(
                `(title: '${groupTitle}'[^}]*items: \\[)([^\\]]*)(\\])`,
                's'
            );

            const newItem = `\n                { name: '${displayName}', href: '${href}', icon: 'FileText' },`;

            content = content.replace(groupPattern, (match, before, items, after) => {
                // Check if item already in group
                if (items.includes(`href: '${href}'`)) return match;
                return before + items + newItem + after;
            });
        } else {
            // Create new group
            const newGroup = `{
            title: '${groupTitle}',
            icon: 'Package',
            items: [
                { name: '${displayName}', href: '${href}', icon: 'FileText' },
            ]
        },
        ${groupInjectionMarker}`;

            content = content.replace(groupInjectionMarker, newGroup);
        }
    } else {
        // No product: add as standalone group (single-item group)
        const newGroup = `{
            title: '${displayName}',
            icon: 'Folder',
            items: [
                { name: '${displayName}', href: '${href}', icon: 'FileText' },
            ]
        },
        ${groupInjectionMarker}`;

        content = content.replace(groupInjectionMarker, newGroup);
    }

    fs.writeFileSync(navPath, content, "utf-8");
    console.log(`🧭 Navigation updated: Added ${moduleName} to Sidebar${productName ? ` (group: ${productName})` : ''}.`);
}

/**
 * Helper to get icon based on module name patterns
 */
export function inferIcon(moduleName: string): string {
    const patterns: Record<string, string> = {
        user: 'Users',
        profile: 'Users',
        post: 'FileText',
        article: 'FileText',
        comment: 'MessageSquare',
        product: 'Package',
        order: 'ShoppingCart',
        category: 'Folder',
        setting: 'Settings',
        config: 'Settings',
    };

    const lower = moduleName.toLowerCase();
    for (const [pattern, icon] of Object.entries(patterns)) {
        if (lower.includes(pattern)) return icon;
    }

    return 'FileText';
}
