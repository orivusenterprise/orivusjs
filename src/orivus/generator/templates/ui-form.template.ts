import { ParsedModuleSpec, ParsedField } from "../../core/spec-parser";

/**
 * Generates a Create Form component for a module
 * Following the pattern from src/domain/user/ui/CreateUserForm.tsx
 */
export function generateFormComponent(spec: ParsedModuleSpec): string {
    const model = spec.models[0];
    const modelName = model.name;
    const moduleName = spec.moduleName;

    // Find the create action (could be 'create', 'add', 'new', etc.)
    const createAction = spec.actions.find(a =>
        a.name.toLowerCase().includes('create') ||
        a.name.toLowerCase().includes('add') ||
        a.name.toLowerCase().includes('new')
    );

    if (!createAction) {
        return `// No create action found for ${modelName}`;
    }

    const actionName = createAction.name;
    const inputFields = createAction.input || [];

    // Generate state declarations
    const stateDeclarations = inputFields
        .map(field => `    const [${field.name}, set${capitalize(field.name)}] = useState${getStateType(field)}(${getDefaultValue(field)});`)
        .join('\n');

    // Generate reset logic
    const resetStatements = inputFields
        .map(field => `            set${capitalize(field.name)}(${getDefaultValue(field)});`)
        .join('\n');

    // Generate input object for mutation
    const inputObject = inputFields
        .map(field => `${field.name}`)
        .join(', ');

    // Generate form fields
    const formFields = inputFields
        .map(field => generateFormField(field))
        .join('\n\n');

    return `"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc";

export function Create${modelName}Form() {
${stateDeclarations}
    const utils = trpc.useContext();

    const mutation = trpc.${moduleName}.${actionName}.useMutation({
        onSuccess: () => {
${resetStatements}
            utils.${moduleName}.invalidate();
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({ ${inputObject} });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium">Create New ${modelName}</h3>
${formFields}
            <button
                type="submit"
                disabled={mutation.isLoading}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
                {mutation.isLoading ? "Creating..." : "Create ${modelName}"}
            </button>
            {mutation.error && (
                <p className="text-red-500 text-sm">{mutation.error.message}</p>
            )}
        </form>
    );
}
`;
}

function generateFormField(field: ParsedField): string {
    const label = capitalize(field.name);
    const setterName = `set${capitalize(field.name)}`;

    // Determine input type based on field type
    let inputType = "text";
    let inputElement = "input";

    switch (field.type) {
        case "string":
            inputType = "text";
            break;
        case "number":
            inputType = "number";
            break;
        case "boolean":
            inputType = "checkbox";
            break;
        case "date":
            inputType = "date";
            break;
    }

    // For text content, use textarea
    if (field.name.toLowerCase().includes('content') ||
        field.name.toLowerCase().includes('description') ||
        field.name.toLowerCase().includes('bio')) {
        inputElement = "textarea";
    }

    if (inputElement === "textarea") {
        return `            <div>
                <label className="block text-sm font-medium text-gray-700">${label}</label>
                <textarea
                    value={${field.name}}
                    onChange={(e) => ${setterName}(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    rows={4}
                    ${field.required ? 'required' : ''}
                />
            </div>`;
    }

    if (inputType === "checkbox") {
        return `            <div className="flex items-center">
                <input
                    type="checkbox"
                    checked={${field.name}}
                    onChange={(e) => ${setterName}(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label className="ml-2 block text-sm text-gray-900">${label}</label>
            </div>`;
    }

    return `            <div>
                <label className="block text-sm font-medium text-gray-700">${label}</label>
                <input
                    type="${inputType}"
                    value={${field.name}}
                    onChange={(e) => ${setterName}(${inputType === 'number' ? 'Number(e.target.value)' : 'e.target.value'})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    ${field.required ? 'required' : ''}
                />
            </div>`;
}

function getStateType(field: ParsedField): string {
    switch (field.type) {
        case "number": return "<number>";
        case "boolean": return "<boolean>";
        default: return "<string>";
    }
}

function getDefaultValue(field: ParsedField): string {
    switch (field.type) {
        case "number": return "0";
        case "boolean": return "false";
        default: return '""';
    }
}

function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
