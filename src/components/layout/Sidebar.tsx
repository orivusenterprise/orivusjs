"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@orivus-ui/lib/utils";
import { navigationConfig } from "@/config/navigation";
import { NavItem, NavGroup } from "@/types/nav";
import {
    Home, List, Settings, Database, Folder, Users, BookOpen,
    ChevronDown, ChevronRight, Package, Layers, FileText
} from "lucide-react";

/**
 * Sidebar v2 (v0.5.0)
 * 
 * Features:
 * - Collapsible groups
 * - Active state indicators  
 * - Smart icon mapping
 * - Footer section
 */

const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Home,
    List,
    Settings,
    Database,
    Folder,
    Users,
    BookOpen,
    Package,
    Layers,
    FileText,
};

function getIcon(iconName?: string): React.ComponentType<{ className?: string }> {
    return IconMap[iconName || "Folder"] || Folder;
}

interface NavLinkProps {
    item: NavItem;
    isActive: boolean;
}

function NavLink({ item, isActive }: NavLinkProps) {
    const Icon = getIcon(item.icon);

    return (
        <Link
            href={item.href}
            className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
        >
            <Icon className="h-4 w-4" />
            {item.name}
        </Link>
    );
}

interface CollapsibleGroupProps {
    group: NavGroup;
    pathname: string;
}

function CollapsibleGroup({ group, pathname }: CollapsibleGroupProps) {
    const [isOpen, setIsOpen] = useState(!group.defaultCollapsed);
    const Icon = getIcon(group.icon);
    const hasActiveChild = group.items.some(item => pathname === item.href || pathname.startsWith(item.href + '/'));

    return (
        <div className="space-y-1">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    hasActiveChild
                        ? "bg-accent/50 text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
            >
                <Icon className="h-4 w-4" />
                <span className="flex-1 text-left">{group.title}</span>
                {isOpen ? (
                    <ChevronDown className="h-4 w-4" />
                ) : (
                    <ChevronRight className="h-4 w-4" />
                )}
            </button>

            {isOpen && (
                <div className="ml-4 space-y-1 border-l border-border pl-3">
                    {group.items.map((item) => (
                        <NavLink
                            key={item.href}
                            item={item}
                            isActive={pathname === item.href}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-screen w-64 flex-col border-r bg-card">
            {/* Logo */}
            <div className="flex h-16 items-center gap-2 border-b px-6">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                    <Layers className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold">OrivusJS</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Main Items */}
                <div className="space-y-1">
                    {navigationConfig.mainItems.map((item) => (
                        <NavLink
                            key={item.href}
                            item={item}
                            isActive={pathname === item.href}
                        />
                    ))}
                </div>

                {/* Groups (Modules) */}
                {navigationConfig.groups.length > 0 && (
                    <div className="space-y-2">
                        <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Modules
                        </p>
                        {navigationConfig.groups.map((group) => (
                            <CollapsibleGroup
                                key={group.title}
                                group={group}
                                pathname={pathname}
                            />
                        ))}
                    </div>
                )}
            </nav>

            {/* Footer */}
            <div className="border-t p-4 space-y-1">
                {navigationConfig.footerItems.map((item) => (
                    <NavLink
                        key={item.href}
                        item={item}
                        isActive={pathname === item.href}
                    />
                ))}

                <div className="pt-4 px-3">
                    <p className="text-xs text-muted-foreground">
                        OrivusJS v0.5.0
                    </p>
                </div>
            </div>
        </div>
    );
}
