import fs from "fs";
import path from "path";
import { ParsedModuleSpec } from "../../core/spec-parser";
import { generatePrismaModel } from "../templates/prisma-model.template";

export function updatePrismaSchema(spec: ParsedModuleSpec, root: string) {
    const prismaPath = path.join(root, "prisma/schema.prisma");
    let file = fs.readFileSync(prismaPath, "utf-8");

    const model = spec.models[0];
    const modelDefinition = generatePrismaModel(model);

    // Añadir modelo si no existe
    if (!file.includes(`model ${model.name} `)) {
        file += `\n${modelDefinition}`;
        fs.writeFileSync(prismaPath, file);
        console.log(`🟦 Prisma: modelo ${model.name} añadido.`);
    } else {
        console.log(`🟨 Prisma: modelo ${model.name} ya existe.`);
    }
}