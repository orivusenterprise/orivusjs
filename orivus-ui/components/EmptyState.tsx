"use client";

import { LucideIcon, PackageOpen } from "lucide-react";
import { cn } from "@orivus-ui/lib/utils";

interface EmptyStateProps {
    title?: string;
    description?: string;
    icon?: LucideIcon;
    className?: string;
    action?: React.ReactNode;
}

export function EmptyState({
    title = "No data found",
    description = "There are no items to display at the moment.",
    icon: Icon = PackageOpen,
    className,
    action
}: EmptyStateProps) {
    return (
        <div className={cn(
            "flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed",
            className
        )}>
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <Icon className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    {description}
                </p>
                {action && (
                    <div className="mt-2">
                        {action}
                    </div>
                )}
            </div>
        </div>
    );
}
