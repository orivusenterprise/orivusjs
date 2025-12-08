"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@orivus-ui/components/Card";
import Link from "next/link";
import { Button } from "@orivus-ui/components/Button";
import { ArrowRight, Bot, Box, Check, Code2, Database, Layers, Terminal, Wand2 } from "lucide-react";
import { Separator } from "@orivus-ui/components/Separator";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* HERO SECTION */}
            <section className="flex flex-col items-center justify-center pt-24 pb-16 px-4 text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                    v0.5-alpha Developer Preview
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                    The AI-Native <br /> Full-Stack Framework
                </h1>

                <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                    OrivusJS isn't just a framework. It's a protocol for humans and AI to build software together.
                    Hexagonal Architecture, Domain-Driven Design, and LLM-ready out of the box.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                    <Button size="lg" className="h-12 px-8 text-base gap-2">
                        Get Started <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Link href="/docs">
                        <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                            Read Documentation
                        </Button>
                    </Link>
                </div>
            </section>

            <Separator className="my-8 max-w-4xl mx-auto" />

            {/* FEATURES GRID */}
            <section className="container mx-auto px-4 py-16 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Feature 1 */}
                    <Card className="bg-gradient-to-br from-card to-secondary/10 border-muted/40 shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="space-y-1">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                                <Bot className="h-5 w-5 text-primary" />
                            </div>
                            <CardTitle>AI-First DNA</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground">
                            Built from the ground up to be understood by Cursor, Copilot, and custom Agents. Your codebase <i>is</i> the context.
                        </CardContent>
                    </Card>

                    {/* Feature 2 */}
                    <Card className="bg-gradient-to-br from-card to-secondary/10 border-muted/40 shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="space-y-1">
                            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-2">
                                <Box className="h-5 w-5 text-indigo-500" />
                            </div>
                            <CardTitle>Hexagonal UI</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground">
                            UI components live in a detached <code>orivus-ui</code> module. Swap your design system without breaking your business logic.
                        </CardContent>
                    </Card>

                    {/* Feature 3 */}
                    <Card className="bg-gradient-to-br from-card to-secondary/10 border-muted/40 shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="space-y-1">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-2">
                                <Layers className="h-5 w-5 text-emerald-500" />
                            </div>
                            <CardTitle>Domain-Driven</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground">
                            Code is organized by feature (Vertical Slices), not tech. Delete a folder, delete a feature. Zero spaghetti.
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* TERMINAL / QUICKSTART */}
            <section className="container mx-auto px-4 pb-24 max-w-4xl">
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                    <div className="flex items-center gap-2 border-b bg-muted/50 p-4">
                        <Terminal className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Quick Start</span>
                    </div>
                    <div className="p-6 bg-zinc-950 font-mono text-sm text-zinc-50 overflow-x-auto">
                        <div className="flex flex-col gap-2">
                            <span className="text-zinc-500"># Create a new module from a spec</span>
                            <div className="flex gap-2">
                                <span className="text-emerald-400">❯</span>
                                <span>npm run orivus:create specs/blog.json</span>
                            </div>
                            <span className="text-zinc-500 mt-2"># Output:</span>
                            <div className="pl-4 text-zinc-400">
                                <span>✓ Generated Schema & Service</span><br />
                                <span>✓ Created tRPC Router</span><br />
                                <span>✓ Scaffolder UI Components</span><br />
                                <span>✓ Injected into Sidebar</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}