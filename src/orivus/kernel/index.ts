/**
 * Orivus Kernel
 * 
 * The intelligence layer of OrivusJS that understands:
 * - Module relationships
 * - Cross-module dependencies
 * - Schema structure
 * 
 * @version 0.5.0 - Kernel Lite
 */

export {
    // Types
    type RelationEdge,
    type ModuleNode,
    type RelationGraph,
    // Core Functions
    buildRelationGraph,
    getDependencies,
    getDependents,
    getRelationFields,
    hasDependency,
    detectCircularDependencies,
    getGenerationOrder,
    summarizeGraph,
} from "./relation-graph";
