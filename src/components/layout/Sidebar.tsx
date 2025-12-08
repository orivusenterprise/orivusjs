"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@orivus-ui/lib/utils";
import { navigation } from "@/config/navigation";
import { Home, List, Component, Settings, Database, Folder, Users } from "lucide-react";

const IconMap: Record<string, any> = {
    Home,
    List,
    Component,
    Settings,
    Database,
    Folder,
    Users
};

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-screen w-64 flex-col border-r bg-card px-4 py-8">
            <div className="mb-8 flex items-center gap-2 px-2">
                <div className="h-8 w-8 rounded-lg bg-primary" />
                <span className="text-xl font-bold">OrivusJS</span>
            </div>

            <nav className="flex-1 space-y-1">
                {navigation.map((item) => {
                    const Icon = IconMap[item.icon || "List"] || List;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t pt-4">
                <div className="px-2 py-2">
                    <p className="text-xs text-muted-foreground">Orivus v0.4.x</p>
                </div>
            </div>
        </div>
    );
}
