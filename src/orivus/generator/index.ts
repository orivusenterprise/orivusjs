// orivus/generator/index.ts

import path from "path";
import { ModuleSpec } from "../core/module-spec";
import { parseModuleSpec } from "../core/spec-parser";
import { generateModule } from "./module-generator";

interface GenerateOptions {
    /** Product name for navigation grouping (optional) */
    productName?: string;
}

/**
 * Punto de entrada principal del generador de OrivusJS v0.2
 *
 * 1. Recibe un ModuleSpec (lo puede crear un humano o un LLM)
 * 2. Lo valida y normaliza con parseModuleSpec
 * 3. Llama a generateModule para crear:
 *    - schema.ts
 *    - service.ts
 *    - router.ts
 *    - modelo en Prisma
 *    - registro en el router global
 *
 * @param rawSpec - Especificación del módulo (ModuleSpec)
 * @param projectRoot - Ruta raíz del proyecto (por defecto: process.cwd())
 * @param options - Generation options (productName, etc.)
 */
export async function generateFromSpec(
    rawSpec: ModuleSpec,
    projectRoot?: string,
    options: GenerateOptions = {}
) {
    const root = projectRoot ?? path.resolve(process.cwd());

    console.log(`\n🔍 [OrivusJS] Parseando SPEC para módulo "${rawSpec.name}"...`);

    const parsed = parseModuleSpec(rawSpec);

    console.log(`✅ [OrivusJS] SPEC válido. Generando módulo "${parsed.moduleName}"...\n`);

    await generateModule(parsed, root, options);

    console.log(`🏁 [OrivusJS] Módulo "${parsed.moduleName}" generado con éxito.\n`);

    return parsed;
}