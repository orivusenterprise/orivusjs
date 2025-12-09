"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@orivus-ui/components/Select";

/**
 * RelationSelect v2 (v0.5.0)
 * 
 * Smart relation picker with:
 * - Search with debounce
 * - Loading states
 * - Empty states
 * - Keyboard navigation
 * 
 * This is a pure UI component. Data must be passed via props.
 */

export interface RelationItem {
    id: string;
    name?: string;
    title?: string;
    label?: string;
    [key: string]: any;
}

interface RelationSelectProps {
    /** Items to display in the dropdown */
    items: RelationItem[] | undefined;
    /** Currently selected value (id) */
    value: string;
    /** Called when selection changes */
    onChange: (value: string) => void;
    /** Placeholder text */
    placeholder?: string;
    /** Disable the select */
    disabled?: boolean;
    /** Show loading state */
    isLoading?: boolean;
    /** Enable search filtering */
    searchable?: boolean;
    /** Label for accessibility */
    label?: string;
    /** Error message */
    error?: string;
    /** Whether the field is required */
    required?: boolean;
}

function getDisplayName(item: RelationItem): string {
    return item.name || item.title || item.label || item.id;
}

export function RelationSelect({
    items = [],
    value,
    onChange,
    placeholder = "Select...",
    disabled,
    isLoading,
    searchable = false,
    label,
    error,
    required
}: RelationSelectProps) {
    const [search, setSearch] = useState("");

    // Filter items based on search
    const filteredItems = useMemo(() => {
        if (!searchable || !search.trim()) return items;

        const lowerSearch = search.toLowerCase();
        return items.filter(item =>
            getDisplayName(item).toLowerCase().includes(lowerSearch)
        );
    }, [items, search, searchable]);

    // Find selected item for display
    const selectedItem = useMemo(() =>
        items.find(item => item.id === value),
        [items, value]
    );

    return (
        <div className="space-y-1">
            {label && (
                <label className="text-sm font-medium text-foreground">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <Select
                value={value}
                onValueChange={onChange}
                disabled={disabled || isLoading}
            >
                <SelectTrigger
                    className={`w-full ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
                >
                    <SelectValue
                        placeholder={isLoading ? "Loading..." : placeholder}
                    >
                        {selectedItem ? getDisplayName(selectedItem) : null}
                    </SelectValue>
                </SelectTrigger>

                <SelectContent>
                    {/* Search input (if enabled) */}
                    {searchable && (
                        <div className="p-2 border-b">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    )}

                    {/* Loading state */}
                    {isLoading && (
                        <div className="p-4 text-center">
                            <div className="animate-pulse space-y-2">
                                <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
                                <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
                                <div className="h-4 bg-muted rounded w-2/3 mx-auto"></div>
                            </div>
                        </div>
                    )}

                    {/* Items */}
                    {!isLoading && filteredItems.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                            {getDisplayName(item)}
                        </SelectItem>
                    ))}

                    {/* Empty state */}
                    {!isLoading && filteredItems.length === 0 && (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            {search ? "No results found" : "No items available"}
                        </div>
                    )}
                </SelectContent>
            </Select>

            {/* Error message */}
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}

/**
 * Helper hook for debounced search
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    React.useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}
