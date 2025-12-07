import { ParsedModuleSpec } from "../../core/spec-parser";

export function generateRouterFile(spec: ParsedModuleSpec): string {
    const model = spec.models[0];

    const actions = spec.actions
        .map((action) => {
            // 1. Robust Input Schema Generation
            // We reuse the logic from schema.template (conceptually) or implement a mini-mapper here
            // to ensure special types like Date are coerced properly.
            const inputSchema = action.input
                ? `.input(z.object({${action.input
                    .map((f) => {
                        let zodType = `z.any()`;
                        switch (f.type) {
                            case "string":
                                zodType = "z.string()";
                                // Add min(1) for required strings to prevent empty submissions
                                if (f.required) zodType += ".min(1)";
                                break;
                            case "number": zodType = "z.number()"; break;
                            case "boolean": zodType = "z.boolean()"; break;
                            case "date": zodType = "z.coerce.date()"; break; // Fix: Coerce dates
                            case "json": zodType = "z.any()"; break;
                        }
                        if (f.isArray) zodType += ".array()";
                        if (!f.required) zodType += ".optional()";
                        return `${f.name}: ${zodType}`;
                    })
                    .join(",")}}))`
                : "";

            const output =
                action.output.kind === "primitive"
                    ? `.output(z.${action.output.type}())`
                    : action.output.kind === "model"
                        ? `.output(${model.name}Schema${action.output.isArray ? ".array()" : ""})`
                        : "";

            // 2. Heuristic for Query vs Mutation
            // If name suggests modification, use mutation. Default to query.
            const lowerName = action.name.toLowerCase();
            const isMutation = lowerName.startsWith("create") ||
                lowerName.startsWith("add") ||
                lowerName.startsWith("update") ||
                lowerName.startsWith("delete") ||
                lowerName.startsWith("save") ||
                lowerName.startsWith("apply"); // Specific for this case

            const procedureType = isMutation ? "mutation" : "query";

            return `  ${action.name}: publicProcedure${inputSchema}${output}.${procedureType}(async ({ input }) => {
      return ${spec.moduleName}Service.${action.name}(input);
    }),`;
        })
        .join("\n");

    return `
import { z } from "zod";
import { publicProcedure, router } from "../../server/trpc/router";
import { ${spec.moduleName}Service } from "./${spec.moduleName}.service";
import { ${model.name}Schema } from "./${spec.moduleName}.schema";

export const ${spec.moduleName}Router = router({
${actions}
});
`;
}