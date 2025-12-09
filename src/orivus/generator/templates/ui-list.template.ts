import { ParsedModuleSpec, ParsedField } from "../../core/spec-parser";
import { findListAction } from "../../core/action-resolver";

/**
 * Generates a List component for a module
 * Uses global UI components.
 */
export function generateListComponent(spec: ParsedModuleSpec): string {
    const model = spec.models[0];
    const modelName = model.name;
    const moduleName = spec.moduleName;

    // Use centralized action resolver - single source of truth
    const listAction = findListAction(spec.actions);

    if (!listAction) {
        return `// No list action found for ${modelName}`;
    }

    const actionName = listAction.name;

    const displayFields = model.fields.filter(f =>
        !f.name.toLowerCase().includes('id') &&
        !f.name.toLowerCase().includes('createdat') &&
        !f.name.toLowerCase().includes('updatedat') &&
        f.type !== 'relation'
    ).slice(0, 3);

    const fieldDisplays = displayFields.map((field, index) => {
        const className = index === 0 ? 'font-medium' : 'text-sm text-muted-foreground';
        return `                                <p className="${className}">{item.${field.name}}</p>`;
    }).join('\n');

    // Determine strict title field
    const potentialTitleFields = ['name', 'title', 'subject', 'label', 'headline', 'email', 'slug'];
    const titleField = model.fields.find(f => potentialTitleFields.includes(f.name.toLowerCase()));
    const titleExpression = titleField ? `item.${titleField.name}` : `"${modelName} #" + item.id`;

    // Always pass {} for consistency - tRPC accepts empty objects
    // This prevents "Expected N arguments but got 0" when input is defined
    const queryArg = '{}';

    return `"use client";

import { trpc } from "@/utils/trpc";
import { Card, CardHeader, CardTitle, CardContent } from "@orivus-ui/components/Card";

export function ${modelName}List() {
    const { data: items, isLoading } = trpc.${moduleName}.${actionName}.useQuery(${queryArg});

    if (isLoading) return <div className="p-4 text-muted-foreground">Loading ${moduleName}s...</div>;

    if (!items || items.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                    No ${moduleName}s found.
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{${titleExpression}}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1">
${fieldDisplays}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
`;
}
