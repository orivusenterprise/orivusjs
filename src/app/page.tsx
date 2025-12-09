"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@orivus-ui/components/Card";
import Link from "next/link";
import { Button } from "@orivus-ui/components/Button";
import { Activity, ArrowRight, BookOpen, Bot, Box, Code2, Database, Github, Layers, LayoutDashboard, Server, Terminal, Zap } from "lucide-react";
import { Separator } from "@orivus-ui/components/Separator";

export default function Dashboard() {
    return (
        <div className="flex flex-col space-y-8 p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
            {/* HERADER SECTION */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">
                        Welcome to your Orivus AI-Native Application.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="https://github.com/orivusenterprise/orivusjs" target="_blank">
                        <Button variant="outline" size="sm" className="gap-2">
                            <Github className="h-4 w-4" /> Star on GitHub
                        </Button>
                    </Link>
                    <Link href="/docs">
                        <Button size="sm" className="gap-2">
                            <BookOpen className="h-4 w-4" /> Documentation
                        </Button>
                    </Link>
                </div>
            </div>

            <Separator />

            {/* STATS GRID */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:border-primary/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Framework Version</CardTitle>
                        <Bot className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">v0.5.0</div>
                        <p className="text-xs text-muted-foreground">Alpha Preview</p>
                    </CardContent>
                </Card>

                <Card className="hover:border-emerald-500/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Health</CardTitle>
                        <Activity className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-500">Operational</div>
                        <p className="text-xs text-muted-foreground">All systems active</p>
                    </CardContent>
                </Card>

                <Card className="hover:border-blue-500/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Database</CardTitle>
                        <Database className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">Connected</div>
                        <p className="text-xs text-muted-foreground">SQLite (Dev Mode)</p>
                    </CardContent>
                </Card>

                <Card className="hover:border-orange-500/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">API Latency</CardTitle>
                        <Zap className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-500">&lt; 15ms</div>
                        <p className="text-xs text-muted-foreground">Average response time</p>
                    </CardContent>
                </Card>
            </div>

            {/* MAIN CONTENT SPLIT */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

                {/* QUICK START / TERMINAL */}
                <Card className="col-span-4 bg-zinc-950 text-zinc-50 border-zinc-800 shadow-xl overflow-hidden">
                    <CardHeader className="border-b border-zinc-800 bg-zinc-900/50 py-3">
                        <div className="flex items-center gap-2">
                            <Terminal className="h-4 w-4 text-zinc-400" />
                            <CardTitle className="text-sm font-mono text-zinc-100">Quick Start Guide</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 font-mono text-sm leading-relaxed space-y-4">
                        <div className="space-y-2">
                            <p className="text-zinc-500"># 1. Create a module specification (JSON or YAML)</p>
                            <p className="text-zinc-500"># Located in: ./specs/products/social/post.json</p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-zinc-500"># 2. Run the Orivus generator CLI</p>
                            <div className="flex items-center gap-3 bg-zinc-900 p-3 rounded-md border border-zinc-800 group cursor-pointer hover:border-zinc-700 transition-colors">
                                <span className="text-emerald-400 font-bold">❯</span>
                                <span className="text-zinc-100">npm run orivus:create specs/my-module.json</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-zinc-500"># 3. Your module is ready!</p>
                            <div className="pl-4 text-zinc-400 text-xs border-l-2 border-zinc-800 space-y-1">
                                <p>✓ Domain Logic (Service & Schema)</p>
                                <p>✓ API Endpoints (tRPC Router)</p>
                                <p>✓ UI Components (Forms & Lists)</p>
                                <p>✓ Navigation Injection</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* RESOURCES & NEXT STEPS */}
                <Card className="col-span-3 h-full flex flex-col">
                    <CardHeader>
                        <CardTitle>Next Steps</CardTitle>
                        <CardDescription>Explore the capabilities of OrivusJS</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border border-transparent hover:border-muted">
                            <div className="bg-primary/10 p-2 rounded-md">
                                <LayoutDashboard className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm">Customize Dashboard</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Edit <code>src/app/page.tsx</code> to add your own widgets and metrics.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border border-transparent hover:border-muted">
                            <div className="bg-indigo-500/10 p-2 rounded-md">
                                <Layers className="h-5 w-5 text-indigo-500" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm">Define Domain Models</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Create new specs in <code>specs/</code> to define your business entities and relationships.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border border-transparent hover:border-muted">
                            <div className="bg-rose-500/10 p-2 rounded-md">
                                <Code2 className="h-5 w-5 text-rose-500" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm">AI-Assisted Coding</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Our code is optimized for LLMs. Ask Cursor/Copilot to "Add a method to PostService".
                                </p>
                            </div>
                        </div>


                    </CardContent>
                </Card>
            </div>
        </div>
    );
}