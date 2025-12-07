import fs from "fs";
import path from "path";
import { ParsedModuleSpec } from "../../core/spec-parser";
import { generatePrismaModel } from "../templates/prisma-model.template";

export function updatePrismaSchema(spec: ParsedModuleSpec, root: string) {
    const prismaPath = path.join(root, "prisma/schema.prisma");
    let file = fs.readFileSync(prismaPath, "utf-8");

    spec.models.forEach(model => {
        const modelDefinition = generatePrismaModel(model);

        // Añadir modelo si no existe
        if (!file.includes(`model ${model.name} `)) {
            file += `\n${modelDefinition}`;
            console.log(`🟦 Prisma: modelo ${model.name} añadido.`);
        } else {
            console.log(`🟨 Prisma: modelo ${model.name} ya existe.`);
            // TODO v0.3: Logic to update existing models with new fields/relations?
        }
    });

    fs.writeFileSync(prismaPath, file);
}