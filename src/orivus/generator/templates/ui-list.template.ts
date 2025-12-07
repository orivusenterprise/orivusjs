import { ParsedModuleSpec, ParsedField } from "../../core/spec-parser";

/**
 * Generates a List component for a module
 * Following the pattern from src/domain/user/ui/UserList.tsx
 */
export function generateListComponent(spec: ParsedModuleSpec): string {
    const model = spec.models[0];
    const modelName = model.name;
    const moduleName = spec.moduleName;

    // Find the list action
    const listAction = spec.actions.find(a =>
        a.name.toLowerCase().includes('list') ||
        a.name.toLowerCase().includes('all') ||
        a.name.toLowerCase().includes('get')
    );

    if (!listAction) {
        return `// No list action found for ${modelName}`;
    }

    const actionName = listAction.name;

    // Get displayable fields (exclude timestamps, ids, etc.)
    const displayFields = model.fields.filter(f =>
        !f.name.toLowerCase().includes('id') &&
        !f.name.toLowerCase().includes('createdat') &&
        !f.name.toLowerCase().includes('updatedat') &&
        f.type !== 'relation' // Don't display relations in simple list
    ).slice(0, 3); // Show max 3 fields

    // Generate field displays
    const fieldDisplays = displayFields.map((field, index) => {
        const className = index === 0 ? 'font-medium' : 'text-sm text-gray-500';
        return `                        <div className="${className}">{${moduleName}.${field.name}}</div>`;
    }).join('\n');

    return `"use client";

import { trpc } from "@/utils/trpc";

export function ${modelName}List() {
    const { data: ${moduleName}s, isLoading } = trpc.${moduleName}.${actionName}.useQuery();

    if (isLoading) return <div>Loading ${moduleName.toLowerCase()}s...</div>;

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">${modelName} List</h2>
            <ul className="space-y-2">
                {${moduleName}s?.map((${moduleName}) => (
                    <li key={${moduleName}.id} className="p-4 bg-white rounded shadow border border-gray-100">
${fieldDisplays}
                    </li>
                ))}
            </ul>
            {${moduleName}s?.length === 0 && <p className="text-gray-500">No ${moduleName.toLowerCase()}s found.</p>}
        </div>
    );
}
`;
}
