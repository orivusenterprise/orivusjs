/**
 * Orivus Kernel Lite - Relation Graph
 * 
 * A lightweight version of the Orivus Kernel that understands:
 * - Module dependencies
 * - Cross-module relations
 * - Relation types (belongsTo, hasMany, etc.)
 * 
 * This powers:
 * - Smart Relations UI (auto-detect relation fields)
 * - Dependency validation
 * - Future: Context Protocol
 * 
 * @version 0.5.0
 */

import { ParsedModuleSpec, ParsedModel, ParsedField } from "../core/spec-parser";

// ============================================================================
// Types
// ============================================================================

export interface RelationEdge {
    /** Source module name (e.g., "post") */
    from: string;
    /** Target module name (e.g., "user") */
    to: string;
    /** Field name in source that creates the relation (e.g., "author") */
    fieldName: string;
    /** Type of relation */
    relationType: "belongsTo" | "hasMany" | "hasOne" | "manyToMany";
    /** Is this relation required? */
    required: boolean;
    /** The foreign key field name (e.g., "authorId") */
    foreignKey: string;
}

export interface ModuleNode {
    /** Module name in camelCase (e.g., "post") */
    name: string;
    /** Primary model name in PascalCase (e.g., "Post") */
    primaryModel: string;
    /** All models in this module */
    models: string[];
    /** Outgoing relations (this module depends on these) */
    dependsOn: RelationEdge[];
    /** Incoming relations (these modules depend on this) */
    dependedBy: RelationEdge[];
}

export interface RelationGraph {
    /** All modules indexed by name */
    modules: Map<string, ModuleNode>;
    /** All relation edges */
    edges: RelationEdge[];
    /** Quick lookup: which modules does X depend on? */
    dependencies: Map<string, string[]>;
    /** Quick lookup: which modules depend on X? */
    dependents: Map<string, string[]>;
}

// ============================================================================
// Graph Builder
// ============================================================================

/**
 * Build a relation graph from multiple module specs.
 * This is the core of Kernel Lite.
 */
export function buildRelationGraph(specs: ParsedModuleSpec[]): RelationGraph {
    const modules = new Map<string, ModuleNode>();
    const edges: RelationEdge[] = [];
    const dependencies = new Map<string, string[]>();
    const dependents = new Map<string, string[]>();

    // First pass: Create module nodes
    specs.forEach(spec => {
        const moduleName = spec.name.toLowerCase();
        const primaryModel = spec.models[0]?.name || capitalize(spec.name);

        modules.set(moduleName, {
            name: moduleName,
            primaryModel,
            models: spec.models.map(m => m.name),
            dependsOn: [],
            dependedBy: []
        });

        dependencies.set(moduleName, []);
        dependents.set(moduleName, []);
    });

    // Second pass: Extract relations and build edges
    specs.forEach(spec => {
        const sourceName = spec.name.toLowerCase();
        const sourceNode = modules.get(sourceName);
        if (!sourceNode) return;

        spec.models.forEach(model => {
            model.fields.forEach(field => {
                if (field.type === "relation" && field.target) {
                    const targetName = field.target.toLowerCase();

                    // Normalize target to module name (BaseEntity -> baseEntity)
                    const targetModuleName = toCamelCase(field.target);

                    const edge: RelationEdge = {
                        from: sourceName,
                        to: targetModuleName,
                        fieldName: field.name,
                        relationType: (field.relationType as RelationEdge["relationType"]) || "belongsTo",
                        required: field.required !== false,
                        foreignKey: `${field.name}Id`
                    };

                    edges.push(edge);
                    sourceNode.dependsOn.push(edge);

                    // Update dependencies map
                    const deps = dependencies.get(sourceName) || [];
                    if (!deps.includes(targetModuleName)) {
                        deps.push(targetModuleName);
                        dependencies.set(sourceName, deps);
                    }

                    // Update dependents map
                    const depts = dependents.get(targetModuleName) || [];
                    if (!depts.includes(sourceName)) {
                        depts.push(sourceName);
                        dependents.set(targetModuleName, depts);
                    }

                    // Update target node's dependedBy
                    const targetNode = modules.get(targetModuleName);
                    if (targetNode) {
                        targetNode.dependedBy.push(edge);
                    }
                }
            });
        });
    });

    return { modules, edges, dependencies, dependents };
}

// ============================================================================
// Query Functions
// ============================================================================

/**
 * Get all modules that this module depends on.
 */
export function getDependencies(graph: RelationGraph, moduleName: string): string[] {
    return graph.dependencies.get(moduleName.toLowerCase()) || [];
}

/**
 * Get all modules that depend on this module.
 */
export function getDependents(graph: RelationGraph, moduleName: string): string[] {
    return graph.dependents.get(moduleName.toLowerCase()) || [];
}

/**
 * Get all relation fields for a module (for Smart Relations UI).
 */
export function getRelationFields(graph: RelationGraph, moduleName: string): RelationEdge[] {
    const node = graph.modules.get(moduleName.toLowerCase());
    return node?.dependsOn || [];
}

/**
 * Check if module A depends on module B (directly or transitively).
 */
export function hasDependency(
    graph: RelationGraph,
    from: string,
    to: string,
    visited: Set<string> = new Set()
): boolean {
    const fromLower = from.toLowerCase();
    const toLower = to.toLowerCase();

    if (visited.has(fromLower)) return false;
    visited.add(fromLower);

    const directDeps = graph.dependencies.get(fromLower) || [];

    if (directDeps.includes(toLower)) return true;

    // Check transitively
    for (const dep of directDeps) {
        if (hasDependency(graph, dep, toLower, visited)) {
            return true;
        }
    }

    return false;
}

/**
 * Detect circular dependencies in the graph.
 */
export function detectCircularDependencies(graph: RelationGraph): string[][] {
    const cycles: string[][] = [];
    const visited = new Set<string>();
    const stack: string[] = [];

    function dfs(node: string): void {
        if (stack.includes(node)) {
            // Found a cycle
            const cycleStart = stack.indexOf(node);
            cycles.push([...stack.slice(cycleStart), node]);
            return;
        }

        if (visited.has(node)) return;
        visited.add(node);
        stack.push(node);

        const deps = graph.dependencies.get(node) || [];
        for (const dep of deps) {
            dfs(dep);
        }

        stack.pop();
    }

    for (const moduleName of graph.modules.keys()) {
        dfs(moduleName);
    }

    return cycles;
}

/**
 * Get the optimal generation order (topological sort).
 * Modules with no dependencies come first.
 */
export function getGenerationOrder(graph: RelationGraph): string[] {
    const result: string[] = [];
    const visited = new Set<string>();
    const temp = new Set<string>();

    function visit(node: string): void {
        if (visited.has(node)) return;
        if (temp.has(node)) {
            // Circular dependency - just add it
            return;
        }

        temp.add(node);

        const deps = graph.dependencies.get(node) || [];
        for (const dep of deps) {
            visit(dep);
        }

        temp.delete(node);
        visited.add(node);
        result.push(node);
    }

    for (const moduleName of graph.modules.keys()) {
        visit(moduleName);
    }

    return result;
}

/**
 * Generate a summary of the relation graph (for debugging/display).
 */
export function summarizeGraph(graph: RelationGraph): string {
    const lines: string[] = [];

    lines.push("# Orivus Kernel - Relation Graph");
    lines.push("");
    lines.push(`## Modules (${graph.modules.size})`);

    for (const [name, node] of graph.modules) {
        lines.push(`- **${node.primaryModel}** (${name})`);

        if (node.dependsOn.length > 0) {
            lines.push(`  - Depends on: ${node.dependsOn.map(e => e.to).join(", ")}`);
        }

        if (node.dependedBy.length > 0) {
            lines.push(`  - Depended by: ${node.dependedBy.map(e => e.from).join(", ")}`);
        }
    }

    lines.push("");
    lines.push(`## Relations (${graph.edges.length})`);

    for (const edge of graph.edges) {
        const arrow = edge.required ? "──>" : "- ->";
        lines.push(`- ${edge.from}.${edge.fieldName} ${arrow} ${edge.to} (${edge.relationType})`);
    }

    const cycles = detectCircularDependencies(graph);
    if (cycles.length > 0) {
        lines.push("");
        lines.push("## ⚠️ Circular Dependencies");
        cycles.forEach(cycle => {
            lines.push(`- ${cycle.join(" → ")}`);
        });
    }

    return lines.join("\n");
}

// ============================================================================
// Helpers
// ============================================================================

function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function toCamelCase(str: string): string {
    return str.charAt(0).toLowerCase() + str.slice(1);
}
