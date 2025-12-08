import { ParsedModuleSpec } from "../../core/spec-parser";

/**
 * Generates a List Page (screen) for a module
 * Cleaner layout using grid.
 */
export function generateListScreen(spec: ParsedModuleSpec): string {
    const model = spec.models[0];
    const modelName = model.name;

    return `"use client";

import { ${modelName}List, Create${modelName}Form } from "../ui";

export default function ${modelName}ListPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">${modelName}s</h1>
                <p className="text-muted-foreground">Manage your ${modelName.toLowerCase()}s here.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[350px_1fr]">
                <aside>
                    <div className="sticky top-6">
                        <Create${modelName}Form />
                    </div>
                </aside>
                <main>
                    <${modelName}List />
                </main>
            </div>
        </div>
    );
}
`;
}
