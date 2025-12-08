"use client";

import * as React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@orivus-ui/components/Select";

/**
 * RelationSelect
 * 
 * A pure UI component that displays a list of items for selection.
 * It does NOT fetch data directly. Data must be passed via props.
 */

export interface RelationItem {
    id: string;
    name?: string;
    title?: string;
    label?: string;
    [key: string]: any;
}

interface RelationSelectProps {
    items: RelationItem[] | undefined;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    isLoading?: boolean;
}

export function RelationSelect({
    items = [],
    value,
    onChange,
    placeholder,
    disabled,
    isLoading
}: RelationSelectProps) {

    return (
        <Select
            value={value}
            onValueChange={onChange}
            disabled={disabled || isLoading}
        >
            <SelectTrigger className="w-full">
                <SelectValue placeholder={isLoading ? "Loading..." : (placeholder || "Select...")} />
            </SelectTrigger>
            <SelectContent>
                {items?.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                        {item.name || item.title || item.label || item.id}
                    </SelectItem>
                ))}
                {(!items || items.length === 0) && !isLoading && (
                    <div className="p-2 text-sm text-muted-foreground">No items found</div>
                )}
            </SelectContent>
        </Select>
    );
}
