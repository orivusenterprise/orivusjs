import fs from "fs";
import path from "path";
import { ParsedModuleSpec } from "../../core/spec-parser";

/**
 * Registers the new module in the central navigation config.
 * Handles duplicate checks.
 */
export function registerNavigation(spec: ParsedModuleSpec, root: string) {
    // Target: src/config/navigation.ts
    const navPath = path.join(root, "src/config/navigation.ts");

    if (!fs.existsSync(navPath)) {
        console.warn(`⚠️  Navigation config not found at ${navPath}. Skipping sidebar registration.`);
        return;
    }

    let content = fs.readFileSync(navPath, "utf-8");

    const pluralName = spec.moduleName + "s"; // Convention: modules render at /users
    const nameCapitalized = spec.moduleName.charAt(0).toUpperCase() + spec.moduleName.slice(1);

    // Check if already exists
    if (content.includes(`href: '/${pluralName}'`)) {
        console.log(`⚠️  Navigation entry for ${spec.moduleName} already exists.`);
        return;
    }

    // Injection Point
    const injectionMarker = "// ORIVUS_INJECTION_POINT";
    const newEntry = `    { name: '${nameCapitalized}', href: '/${pluralName}', icon: 'Folder' },`;

    if (content.includes(injectionMarker)) {
        content = content.replace(injectionMarker, `${newEntry}\n    ${injectionMarker}`);
        fs.writeFileSync(navPath, content, "utf-8");
        console.log(`🧭 Navigation updated: Added ${spec.moduleName} to Sidebar.`);
    } else {
        console.warn(`⚠️  Could not find injection marker '${injectionMarker}' in navigation.ts`);
    }
}
