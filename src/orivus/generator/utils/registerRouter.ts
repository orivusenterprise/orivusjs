import fs from "fs";
import path from "path";
import { ParsedModuleSpec } from "../../core/spec-parser";

export function registerRouter(spec: ParsedModuleSpec, root: string) {
    // Correct target: index.ts where appRouter is defined
    const routerPath = path.join(root, "src/server/trpc/index.ts");
    let content = fs.readFileSync(routerPath, "utf-8");

    // Use relative path from src/server/trpc/index.ts to src/domain/...
    // ../../domain/...
    const importLine = `import { ${spec.moduleName}Router } from "../../domain/${spec.moduleName}/${spec.moduleName}.router";`;
    const routerLine = `${spec.moduleName}: ${spec.moduleName}Router,`;

    if (content.includes(routerLine)) {
        console.log(`⚠️  Router for ${spec.moduleName} already registered.`);
        return;
    }

    if (!content.includes(importLine)) {
        // Inject import after the last import line
        const lines = content.split("\n");
        const lastImportIndex = lines.reduce((lastIndex, line, index) => {
            if (line.trim().startsWith("import")) return index;
            return lastIndex;
        }, -1);

        if (lastImportIndex !== -1) {
            lines.splice(lastImportIndex + 1, 0, importLine);
        } else {
            lines.unshift(importLine);
        }
        content = lines.join("\n");
    }

    // Inject into router object
    // Regex looking for 'export const appRouter = router({'
    const routerDefRegex = /export const appRouter = router\({/;

    if (routerDefRegex.test(content)) {
        content = content.replace(routerDefRegex, `export const appRouter = router({\n  ${routerLine}`);
        fs.writeFileSync(routerPath, content);
        console.log(`🟩 Router global actualizado con ${spec.moduleName}`);
    } else {
        console.error("❌ Could not find 'appRouter = router({' definition in index.ts");
    }
}