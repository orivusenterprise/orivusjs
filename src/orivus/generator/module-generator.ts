import { ParsedModuleSpec } from "../core/spec-parser";
// Templates
import { generateSchemaFile } from "./templates/schema.template";
import { generateServiceFile } from "./templates/service.template";
import { generateRouterFile } from "./templates/router.template";
import { generateTestFile } from "./templates/test.template";
// Utils
import { updatePrismaSchema } from "./utils/updatePrisma";
import { registerRouter } from "./utils/registerRouter";
// Native Node Modules (Modern Promise API)
import fs from "fs/promises";
import path from "path";
import { writeFileSafely } from "./utils/writeFile";

/**
 * Orchestrates the generation of a full domain module.
 * Creates the directory structure, writes component files, and updates global configs.
 */
export async function generateModule(spec: ParsedModuleSpec, projectRoot: string) {
    const moduleName = spec.moduleName;
    const moduleDir = path.join(projectRoot, "src/domain", moduleName);

    console.log(`\n🛠️  Starting generation for module: ${moduleName}...`);

    try {
        // 1. Create Directory (Idempotent: doesn't fail if exists)
        // recursive: true is safer for nested paths
        await fs.mkdir(moduleDir, { recursive: true });

        // 2. Generate Content in Parallel
        // Generating strings is CPU bound, writing is I/O bound.
        // We prepare all contents first to fail fast if templates break.
        const schemaContent = generateSchemaFile(spec);
        const serviceContent = generateServiceFile(spec);
        const routerContent = generateRouterFile(spec);
        const testContent = generateTestFile(spec);

        // 3. Write Files Asynchronously
        // We use Promise.all to write files in parallel (Faster I/O)
        await Promise.all([
            writeFileSafely(path.join(moduleDir, `${moduleName}.schema.ts`), schemaContent),
            writeFileSafely(path.join(moduleDir, `${moduleName}.service.ts`), serviceContent),
            writeFileSafely(path.join(moduleDir, `${moduleName}.router.ts`), routerContent),
            writeFileSafely(path.join(moduleDir, `${moduleName}.test.ts`), testContent),
        ]);

        console.log(`   - Files created in src/domain/${moduleName}`);

        // 4. Update Global Configurations (Prisma & Main Router)
        // These are critical sections. If they fail, we might want to warn the user.

        // Assumed async for safety (even if currently sync)
        await updatePrismaSchema(spec, projectRoot);
        console.log(`   - Prisma schema updated.`);

        await registerRouter(spec, projectRoot);
        console.log(`   - Global router registered.`);

        // 5. Sync Database (Prisma DB Push)
        // This ensures the new model actually exists in the DB so it can be used immediately.
        console.log(`🔄 Syncing database...`);
        // We use child_process to run the shell command
        const { exec } = await import("child_process");
        const { promisify } = await import("util");
        const execAsync = promisify(exec);

        try {
            // Using --accept-data-loss is risky in prod, but fine for dev prototyping
            // This is crucial for AI-Native iteration speed.
            await execAsync("npx prisma db push --accept-data-loss", { cwd: projectRoot });
            console.log(`   - Database synced (prisma db push).`);
        } catch (dbError: any) {
            console.warn(`⚠️  Database sync failed. You may need to run 'npx prisma db push' manually.`);
            console.warn(`   Error: ${dbError.message}`);
        }

        console.log(`✅ Module ${moduleName} generated successfully.\n`);

    } catch (error: any) {
        // 6. Error Handling & Cleanup Strategy
        console.error(`❌ Failed to generate module ${moduleName}:`);
        console.error(`   ${error.message}`);

        // Advanced: Here you could implement a "Rollback" function 
        // to delete the created folder if the process failed midway.
        // await fs.rm(moduleDir, { recursive: true, force: true });

        throw error; // Re-throw to let the CLI know it failed
    }
}