"use client";

import { Sidebar } from "./Sidebar";
import { ArrowLeft } from "lucide-react";
import { Button } from "@orivus-ui/components/Button";
import { useRouter, usePathname } from "next/navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const isDashboard = pathname === "/";

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans antialiased">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-6 backdrop-blur-md">
                    {!isDashboard && (
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    )}
                    <h1 className="text-sm font-semibold text-foreground/80">
                        {pathname === "/" ? "Dashboard" : pathname.split('/').pop()?.toUpperCase() || "PAGE"}
                    </h1>
                </header>
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
