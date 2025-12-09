#!/usr/bin/env npx tsx
/**
 * Kernel Lite Demo
 * 
 * Run with: npx tsx src/orivus/kernel/demo.ts specs/products/social
 */

import * as fs from "fs";
import * as path from "path";
import { parseModuleSpec } from "../core/spec-parser";
import {
    buildRelationGraph,
    getDependencies,
    getDependents,
    getRelationFields,
    getGenerationOrder,
    detectCircularDependencies,
    summarizeGraph
} from "./relation-graph";

async function main() {
    const productPath = process.argv[2];

    if (!productPath) {
        console.log("Usage: npx tsx src/orivus/kernel/demo.ts <product-path>");
        console.log("Example: npx tsx src/orivus/kernel/demo.ts specs/products/social");
        process.exit(1);
    }

    const absolutePath = path.resolve(productPath);

    // Load manifest
    const manifestPath = path.join(absolutePath, "_manifest.json");
    if (!fs.existsSync(manifestPath)) {
        console.error(`Manifest not found: ${manifestPath}`);
        process.exit(1);
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    console.log(`\n🧠 Kernel Lite Demo: ${manifest.name}\n`);
    console.log("=".repeat(60));

    // Load all specs
    const specs = [];
    for (const file of manifest.executionOrder) {
        const specPath = path.join(absolutePath, file);
        const raw = JSON.parse(fs.readFileSync(specPath, "utf-8"));
        const parsed = parseModuleSpec(raw);
        specs.push(parsed);
    }

    console.log(`\n📦 Loaded ${specs.length} modules: ${specs.map(s => s.name).join(", ")}\n`);

    // Build the graph
    const graph = buildRelationGraph(specs);

    // Show the summary
    console.log(summarizeGraph(graph));
    console.log("\n" + "=".repeat(60));

    // Interactive queries
    console.log("\n📊 Query Examples:\n");

    for (const spec of specs) {
        const deps = getDependencies(graph, spec.name);
        const depts = getDependents(graph, spec.name);
        const relations = getRelationFields(graph, spec.name);

        console.log(`📁 ${spec.name.toUpperCase()}`);
        console.log(`   Depends on: ${deps.length > 0 ? deps.join(", ") : "(none)"}`);
        console.log(`   Depended by: ${depts.length > 0 ? depts.join(", ") : "(none)"}`);

        if (relations.length > 0) {
            console.log(`   Relation fields: ${relations.map(r => `${r.fieldName} → ${r.to}`).join(", ")}`);
        }
        console.log("");
    }

    // Generation order
    console.log("📋 Optimal Generation Order:");
    const order = getGenerationOrder(graph);
    order.forEach((name, idx) => {
        console.log(`   ${idx + 1}. ${name}`);
    });

    // Circular dependencies
    const cycles = detectCircularDependencies(graph);
    if (cycles.length > 0) {
        console.log("\n⚠️  Circular Dependencies Detected:");
        cycles.forEach(cycle => {
            console.log(`   ${cycle.join(" → ")}`);
        });
    } else {
        console.log("\n✅ No circular dependencies");
    }

    console.log("\n" + "=".repeat(60));
    console.log("🧠 Kernel Lite ready for Smart Relations UI\n");
}

main().catch(console.error);
