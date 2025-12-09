/**
 * ============================================================
 * 🎯 ACTION RESOLVER - Single Source of Truth
 * ============================================================
 * 
 * This module centralizes ALL action selection logic.
 * Every template MUST use these functions instead of implementing
 * their own selection logic. This ensures consistency and prevents
 * the "each template uses different heuristics" problem.
 * 
 * RULE: If you need to change how actions are selected, change it HERE.
 *       Never add selection logic to individual templates.
 */

import { ParsedAction } from "./spec-parser";

/**
 * Find the "create" action for a module.
 * Used by: service.template, router.template, ui-form.template, test.template
 */
export function findCreateAction(actions: ParsedAction[]): ParsedAction | undefined {
    // Priority 1: Explicit type
    const explicit = actions.find(a => a.type === 'create');
    if (explicit) return explicit;

    // Priority 2: Name heuristics (legacy fallback)
    const byName = actions.find(a => {
        const name = a.name.toLowerCase();
        return name.startsWith('create') ||
            name.startsWith('add') ||
            name.startsWith('new') ||
            name.startsWith('register') ||
            name.startsWith('invite') ||
            name.startsWith('admit') ||
            name.startsWith('issue') ||
            name.startsWith('schedule');
    });
    if (byName) return byName;

    // Priority 3: First mutation-like action
    return actions.find(a =>
        a.type === 'update' || a.type === 'delete' ||
        !a.name.toLowerCase().startsWith('get') &&
        !a.name.toLowerCase().startsWith('list')
    );
}

/**
 * Find the "list" action for a module.
 * Used by: ui-list.template, test.template
 */
export function findListAction(actions: ParsedAction[]): ParsedAction | undefined {
    // Priority 1: Explicit type
    const explicit = actions.find(a => a.type === 'list');
    if (explicit) return explicit;

    // Priority 2: Output is array
    const byOutput = actions.find(a => (a.output as any)?.isArray === true);
    if (byOutput) return byOutput;

    // Priority 3: Name heuristics (legacy fallback)
    const byName = actions.find(a => {
        const name = a.name.toLowerCase();
        return name.startsWith('list') ||
            name.startsWith('getall') ||
            name.startsWith('find') ||
            name.startsWith('search');
    });
    if (byName) return byName;

    // Priority 4: Any action with "list" or "all" in name
    return actions.find(a => {
        const name = a.name.toLowerCase();
        return name.includes('list') || name.includes('all');
    });
}

/**
 * Find the "get single item" action for a module.
 * Used by: router.template (for detail pages)
 */
export function findGetAction(actions: ParsedAction[]): ParsedAction | undefined {
    // Priority 1: Explicit type
    const explicit = actions.find(a => a.type === 'get');
    if (explicit) return explicit;

    // Priority 2: Name heuristics - must NOT be a list
    const byName = actions.find(a => {
        const name = a.name.toLowerCase();
        const isGet = name.startsWith('get') || name.startsWith('find');
        const isNotList = !(a.output as any)?.isArray;
        return isGet && isNotList;
    });
    return byName;
}

/**
 * Determine if an action is a mutation (modifies data) or query (reads data).
 * Used by: router.template
 */
export function isMutationAction(action: ParsedAction): boolean {
    // Priority 1: Explicit type
    if (action.type) {
        return ['create', 'update', 'delete'].includes(action.type);
    }

    // Priority 2: Name heuristics
    const name = action.name.toLowerCase();
    const mutationPrefixes = [
        'create', 'add', 'new', 'register', 'invite', 'admit', 'issue', 'schedule',
        'update', 'edit', 'modify', 'change', 'set', 'assign', 'move', 'cancel', 'archive',
        'delete', 'remove', 'destroy', 'revoke', 'unlink'
    ];

    return mutationPrefixes.some(prefix => name.startsWith(prefix));
}
