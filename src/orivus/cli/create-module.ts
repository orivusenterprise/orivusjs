import fs from "fs";
import path from "path";
import { generateFromSpec } from "../generator/index";
import { ModuleSpec } from "../core/module-spec";

async function main() {
    const args = process.argv.slice(2);
    let specPath = args[0];

    // Interactive Prompt if no arg provided
    if (!specPath) {
        console.log("❌ Please provide the path to the JSON spec file.");
        console.log("Usage: npm run orivus:create <path-to-spec.json>");
        console.log("Example: npm run orivus:create ./specs/blog.json");
        process.exit(1);
    }

    // Resolve absolute path
    if (!path.isAbsolute(specPath)) {
        specPath = path.join(process.cwd(), specPath);
    }

    if (!fs.existsSync(specPath)) {
        console.error(`❌ File not found: ${specPath}`);
        process.exit(1);
    }

    console.log(`\n📄 Reading Spec from: ${specPath}`);

    try {
        const fileContent = fs.readFileSync(specPath, "utf-8");
        const spec: ModuleSpec = JSON.parse(fileContent);

        // Basic Validation
        if (!spec.name || !spec.models || !spec.actions) {
            console.error("❌ Invalid Spec Format. Missing 'name', 'models', or 'actions'.");
            process.exit(1);
        }

        console.log(`✅ Valid Spec found for module: "${spec.name}"`);

        // Execute Generator
        await generateFromSpec(spec);

    } catch (error: any) {
        console.error("❌ Error processing spec:");
        console.error(error.message);
        process.exit(1);
    }
}

main();
