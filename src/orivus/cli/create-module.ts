import fs from "fs";
import path from "path";
import { generateFromSpec } from "../generator/index";
import { ModuleSpec } from "../core/module-spec";
import { validateSpec, formatValidationResult } from "../core/spec-validator";

async function main() {
    const args = process.argv.slice(2);
    let specPath = args[0];
    const productName = args[1]; // Optional: product name for navigation grouping

    // Interactive Prompt if no arg provided
    if (!specPath) {
        console.log("❌ Please provide the path to the JSON spec file.");
        console.log("Usage: npm run orivus:create <path-to-spec.json> [product-name]");
        console.log("Example: npm run orivus:create ./specs/blog.json 'My Blog'");
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
    if (productName) {
        console.log(`📦 Product Group: ${productName}`);
    }

    try {
        const fileContent = fs.readFileSync(specPath, "utf-8");
        const spec: ModuleSpec = JSON.parse(fileContent);

        // =====================================================
        // v0.4.3: Spec Validation BEFORE generation
        // =====================================================
        console.log("\n🔍 Validating spec...");
        const validation = validateSpec(spec);

        if (!validation.valid) {
            console.error("\n" + formatValidationResult(validation));
            console.error("\n💡 Fix the errors above and try again.");
            process.exit(1);
        }

        // Show warnings but continue
        if (validation.warnings.length > 0) {
            console.log("\n" + formatValidationResult(validation));
            console.log("\n⚠️  Proceeding with generation despite warnings...\n");
        } else {
            console.log("✅ Spec validation passed");
        }

        console.log(`\n📦 Generating module: "${spec.name}"`);

        // Execute Generator with productName option
        await generateFromSpec(spec, undefined, { productName });

    } catch (error: any) {
        if (error instanceof SyntaxError) {
            console.error("❌ Invalid JSON in spec file:");
            console.error(`   ${error.message}`);
            console.error("\n💡 Check for trailing commas or missing quotes in your JSON file.");
        } else {
            console.error("❌ Error processing spec:");
            console.error(error.message);
        }
        process.exit(1);
    }
}

main();

